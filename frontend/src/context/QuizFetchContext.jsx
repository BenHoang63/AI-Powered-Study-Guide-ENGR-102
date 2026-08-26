import { createContext, useContext, useRef } from 'react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const QuizFetchContext = createContext();

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

    /**
     * Pure fetch helper.  Returns question array or null.
     *
     * @param {Object}   config
     * @param {number[]} config.chapters    – pool of chapter ids to pick from
     * @param {string[]} config.types       – pool of question type keys
     * @param {number}   [config.extraSlots] – array length (TopicQuizzer = 8, Exam = 5)
     */
    const fetchQuestionData = async ({ chapters, types, extraSlots = 5 }) => {
        const ch = chapters[Math.floor(Math.random() * chapters.length)];
        const questionType = types[Math.floor(Math.random() * types.length)];

        let tp = 1;
        try {
            const res = await fetch(`${BACKEND_URL}/api/engr102/${ch}/num_topics`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            tp = Math.ceil(Math.random() * data.topicCount) || 1;
        } catch (err) {
            console.error('[QuizFetchContext] Could not get topic count:', err);
            return null;
        }

        try {
            const res2 = await fetch(`${BACKEND_URL}/api/engr102/quiz/question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chapter: ch, topic: tp, type: questionType }),
            });
            if (!res2.ok) throw new Error(res2.statusText);
            const data2 = await res2.json();

            return extraSlots === 8
                ? [ch, tp, data2.topic_name, data2.llm_response, null, false, false, false]
                : [ch, tp, data2.topic_name, data2.llm_response, null];
        } catch (err) {
            console.error('[QuizFetchContext] Could not fetch question:', err);
            return null;
        }
    };

    /**
     * Start a background prefetch for the given channel.
     * If a fetch is already in-flight (or resolved but unconsumed), this is a no-op.
     */
    const prefetch = (channel, config) => {
        const slot = prefetchMap.current[channel];
        if (slot && (slot.promise || slot.data)) return; // already in-flight or ready

        const promise = fetchQuestionData(config);
        const entry = { promise, resolved: false, data: null };
        prefetchMap.current[channel] = entry;

        promise.then((result) => {
            entry.resolved = true;
            entry.data = result;
            entry.promise = null; // no longer in-flight
        }).catch(() => {
            entry.resolved = true;
            entry.data = null;
            entry.promise = null;
        });
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
        if (!slot) return null;

        let result;
        if (slot.promise) {
            // Still in-flight — await it
            result = await slot.promise;
        } else {
            // Already resolved
            result = slot.data;
        }

        // Clear the slot
        prefetchMap.current[channel] = null;
        return result;
    };

    return (
        <QuizFetchContext.Provider value={{ fetchQuestionData, prefetch, consumePrefetch, isPrefetchReady }}>
            {children}
        </QuizFetchContext.Provider>
    );
};

export const useQuizFetch = () => useContext(QuizFetchContext);
