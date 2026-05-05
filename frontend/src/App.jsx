import { useState } from 'react'
import './App.css'

function App() {


	function parseJwt(token) {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	function handleCredentialResponse(response) {
		const userObject = parseJwt(response.credential);
		const email = userObject.email;
		const name = userObject.name;

		console.log(name, email);
	}


  return (
    <>
      <header>
        <h1>ENGR 102 Study Helper</h1>
		<script src="https://accounts.google.com/gsi/client" async defer></script>
      </header>
      <section id="center">
        <div>
			<div id="g_id_onload"
				data-client_id="204437338049-3o5toq7ppruh0un7kod61mgeonaldpv1.apps.googleusercontent.com"
				data-callback="handleCredentialResponse"
				data-auto_select="false">
			</div>
			<div>
				<h2>Sign In With Your TAMU Email</h2>
				<div class="g_id_signin"
					data-type="standard"
					data-size="large"
					data-theme="outline"
					data-text="sign_in_with"  
					data-shape="rectangular"
					data-logo_alignment="left">
				</div>
			</div>
		  
        </div>
      </section>
    </>
  )
}

export default App
