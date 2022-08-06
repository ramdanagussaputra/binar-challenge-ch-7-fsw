'use strict';

class homeApp {
    btnLogin = document.querySelector('.login');
    btnCloseModal = document.querySelector('.modal-icon--btn');
    btnLoginForm = document.querySelector('.login-btn');
    btnPlayGame = document.querySelector('.play-game');
    btnSignOut = document.querySelector('.sign-out');
    btnDashboard = document.querySelector('.btn-dashboard');

    NavSignUpEl = document.querySelector('.nav-signup');
    NavSignOutEl = document.querySelector('.nav-signout');
    welcomeMessage = document.querySelector('.welcome-message');
    modalEl = document.querySelector('.modal-cus');
    popUpEl = document.querySelector('.login-popup');
    usernameEl = document.querySelector('#username');
    passwordEl = document.querySelector('#password');

    usernameValue = null;
    passwordValue = null;

    constructor() {
        this.btnLogin.addEventListener('click', this._showModal.bind(this));
        this.btnCloseModal.addEventListener('click', this._closeModal.bind(this));
        this.btnLoginForm.addEventListener('click', this._formValue.bind(this));
        this.btnPlayGame.addEventListener('click', this._playGame.bind(this));
        this.btnSignOut.addEventListener('click', this._signOut.bind(this));
        this._checkIfAlreadyLogin();
    }

    _showModal() {
        this.modalEl.classList.remove('modal-cus--hide');
    }

    _closeModal() {
        this.modalEl.classList.add('modal-cus--hide');
    }

    _formValue(e) {
        e.preventDefault();

        // Get username and password
        this.usernameValue = this.usernameEl.value;
        this.passwordValue = this.passwordEl.value;

        this._postFormValue(this.usernameValue, this.passwordValue);

        // Reset value
        this.usernameEl.value = '';
        this.passwordEl.value = '';

        // Close modal
        this._closeModal();
    }

    async _postFormValue(username, password) {
        try {
            // Post data to server
            const res = await fetch('/', {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, password, ok: true }),
            });

            // Convert response data to json
            const resServer = await res.json();
            console.log(resServer);

            // Show pop up
            this._showPopUp(resServer.message);

            // Check if login success
            if (!(resServer.status === 'success')) return resServer;

            // Login successful state
            this.NavSignUpEl.classList.add('nav-sign--hidden');
            this.NavSignOutEl.classList.remove('nav-sign--hidden');
            this.welcomeMessage.textContent = `Welcome back, ${resServer.data.userData.biodata[0].firstName}`;

            // Check if admin
            if (resServer.data.userData.isAdmin) {
                this.btnDashboard.classList.remove('not-admin');
            }

            // Set data to cookies
            const value = {
                username: resServer.data.userData.username,
                ok: true,
                isAdmin: resServer.data.userData.isAdmin,
            };
            this._setCookies(resServer.status, 'acc', JSON.stringify(value), 1);

            return resServer;
        } catch (err) {
            console.error(err);
        }
    }

    _showPopUp(message) {
        this.popUpEl.innerHTML = `<p class="login-message">${message}</p>`;
        this.popUpEl.classList.remove('login-popup--hide');

        setTimeout(() => this.popUpEl.classList.add('login-popup--hide'), 2000);
    }

    _setCookies(status, name, value = '', days = 1) {
        if (!(status === 'success')) return;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
    }

    _getCookies() {
        try {
            const accCookies = document.cookie;
            const accIndex = document.cookie.indexOf('{');
            const data = JSON.parse(accCookies.slice(accIndex));
            return data;
        } catch {
            return { ok: false };
        }
    }

    _eraseCookie(name) {
        document.cookie = name + '=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }

    _playGame() {
        const { ok } = this._getCookies();

        if (!ok) return this._showModal();
        location.href = '/game';
    }

    _signOut() {
        this.NavSignUpEl.classList.remove('nav-sign--hidden');
        this.NavSignOutEl.classList.add('nav-sign--hidden');
        this._eraseCookie('acc');
        this._showPopUp('You out of the game');
    }

    _checkIfAlreadyLogin() {
        const { ok, username, isAdmin } = this._getCookies();

        if (!ok) return;
        this.NavSignUpEl.classList.add('nav-sign--hidden');
        this.NavSignOutEl.classList.remove('nav-sign--hidden');
        this.welcomeMessage.textContent = `Welcome back, ${username}`;

        if (!isAdmin) return;
        this.btnDashboard.classList.remove('not-admin');
    }
}

new homeApp();
