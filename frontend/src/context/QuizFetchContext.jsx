import { createContext, useContext, useRef } from 'react';

const QuizFetchContext = createContext();

/**
 * Cryptographically secure random integer generator [0, max - 1].
 * Uses crypto.getRandomValues for uniform hardware/OS entropy.
 */
const getSecureRandomInt = (max) => {
    if (max <= 1) return 0;
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return buf[0] % max;
};

/**
 * QuizFetchProvider — lives at the app root so background fetches
 * survive React-Router page navigation.
 *
 * Maintains independent prefetch "channels" (e.g. 'topicQuizzer',
 * 'examQuizzer') so the two quizzers never steal each other's
 * prefetched questions.
 */
export const QuizFetchProvider = ({ children }) => {
    // Map of channel → { promise, resolved, data }
    const prefetchMap = useRef({});

    const topicCountsCache = useRef({});

    // Shuffled decks of question types per channel (Fisher-Yates via crypto.getRandomValues)
    const typeDecks = useRef({});

    /**
     * Draws the next question type from a cryptographically shuffled deck.
     * Guarantees every selected type is dealt before repeating, with no back-to-back repeats.
     */
    const getNextQuestionType = (types, channel = 'default') => {
        if (!types || types.length === 0) return 'multiple_choice';
        if (types.length === 1) return types[0];

        const typesKey = [...types].sort().join(',');
        let deckState = typeDecks.current[channel];

        // If deck is missing, invalidated by type changes, or exhausted, create & shuffle a new one
        if (!deckState || deckState.typesKey !== typesKey || deckState.cards.length === 0) {
            const newCards = [...types];
            // Cryptographically secure Fisher-Yates shuffle
            for (let i = newCards.length - 1; i > 0; i--) {
                const j = getSecureRandomInt(i + 1);
                [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
            }
            // Prevent the first card from matching the last card dealt from the previous deck
            if (deckState?.lastPopped && newCards[newCards.length - 1] === deckState.lastPopped && newCards.length > 1) {
                [newCards[0], newCards[newCards.length - 1]] = [newCards[newCards.length - 1], newCards[0]];
            }
            deckState = {
                cards: newCards,
                typesKey,
                lastPopped: deckState?.lastPopped || null,
            };
        }

        const nextType = deckState.cards.pop();
        deckState.lastPopped = nextType;
        typeDecks.current[channel] = deckState;
        return nextType;
    };

    /**
     * Pure fetch helper. Returns question array or null.
     *
     * @param {Object}   config
     * @param {number[]} config.chapters    – pool of chapter ids to pick from
     * @param {string[]} config.types       – pool of question type keys
     * @param {number}   [config.extraSlots] – array length (TopicQuizzer = 8, Exam = 5)
     * @param {string}   [config.channel]   – prefetch channel identifier
     */
    const fetchQuestionData = async ({ chapters, types, extraSlots = 5, channel = 'default', isFirstQuestion = false }) => {
        const ch = chapters[getSecureRandomInt(chapters.length)];
        const questionType = getNextQuestionType(types, channel);

        // If topic count is cached in memory, pick a random topic; otherwise, let the backend RAG pipeline pick directly in 1 round trip!
        let tp = topicCountsCache.current[ch]
            ? getSecureRandomInt(topicCountsCache.current[ch]) + 1
            : undefined;

        try {
            const res2 = await fetch('/api/engr102/quiz/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chapter: ch, 
                    ...(tp ? { topic: tp } : {}), 
                    type: questionType,
                    isFirstQuestion: Boolean(isFirstQuestion)
                }),
            });
            if (!res2.ok) throw new Error(res2.statusText);
            const data2 = await res2.json();
            if (data2.topic_count) {
                topicCountsCache.current[ch] = data2.topic_count;
            }
            const actualTopic = data2.topic_number || tp || 1;

            return extraSlots === 8
                ? [ch, actualTopic, data2.topic_name, data2.llm_response, null, false, false, false]
                : [ch, actualTopic, data2.topic_name, data2.llm_response, null];
        } catch (err) {
            console.error('[QuizFetchContext] Could not fetch question:', err);
            return null;
        }
    };

    /**
     * Start a background prefetch for the given channel.
     * If a fetch is already in-flight (or resolved but unconsumed), returns the active promise or resolved data.
     */
    const prefetch = (channel, config) => {
        const slot = prefetchMap.current[channel];
        if (slot && (slot.promise || slot.data)) {
            // Already in-flight or ready
            return slot.promise || Promise.resolve(slot.data);
        }

        console.log(`[QuizFetch] Starting prefetch for [${channel}]...`, {
            chapters: config.chapters,
            types: config.types
        });

        const promise = fetchQuestionData({ ...config, channel });
        const entry = { promise, resolved: false, data: null };
        prefetchMap.current[channel] = entry;

        promise.then((result) => {
            entry.resolved = true;
            entry.data = result;
            entry.promise = null; // no longer in-flight
            console.log(`[QuizFetch] Prefetch ready for [${channel}]!`, result ? `Chapter ${result[0]}, Topic ${result[1]} (${result[3]?.type})` : 'null result');
        }).catch((err) => {
            entry.resolved = true;
            entry.data = null;
            entry.promise = null;
            console.error(`[QuizFetch] Prefetch error for [${channel}]:`, err);
        });

        return promise;
    };

    /**
     * Check whether a prefetch for this channel has finished.
     */
    const isPrefetchReady = (channel) => {
        const slot = prefetchMap.current[channel];
        return slot?.resolved === true;
    };

    /**
     * Consume (and clear) the prefetched data for the given channel.
     * Returns the Promise (if still in-flight) or the resolved data, or null.
     * After calling this, the slot is cleared so a new prefetch can be started.
     */
    const consumePrefetch = async (channel) => {
        const slot = prefetchMap.current[channel];
        if (!slot) {
            console.log(`[QuizFetch] consumePrefetch: Cache miss for [${channel}] (no slot)`);
            return null;
        }

        let result;
        if (slot.promise) {
            console.log(`[QuizFetch] consumePrefetch: In-flight prefetch for [${channel}] is still resolving, waiting...`);
            result = await slot.promise;
        } else {
            console.log(`[QuizFetch] consumePrefetch: Cache HIT for [${channel}]! Instant load.`);
            result = slot.data;
        }

        // Clear the slot so the next question can be prefetched
        prefetchMap.current[channel] = null;
        return result;
    };

    /**
     * Clear / invalidate any prefetch for the given channel.
     */
    const clearPrefetch = (channel) => {
        console.log(`[QuizFetch] Cleared prefetch cache for [${channel}]`);
        prefetchMap.current[channel] = null;
        typeDecks.current[channel] = null;
    };

    return (
        <QuizFetchContext.Provider value={{ fetchQuestionData, prefetch, consumePrefetch, clearPrefetch, isPrefetchReady }}>
            {children}
        </QuizFetchContext.Provider>
    );
};

export const useQuizFetch = () => useContext(QuizFetchContext);
