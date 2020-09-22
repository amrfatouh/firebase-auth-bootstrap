const loginForm = document.querySelector('#login-form');
loginForm.onsubmit = function (e) {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password);

    loginForm.reset();
    $('#login-modal').modal('hide');
}

const signupForm = document.querySelector('#sign-up-form');
signupForm.onsubmit = function (e) {
    e.preventDefault();
    const email = signupForm['sign-up-email'].value;
    const password = signupForm['sign-up-password'].value;
    auth.createUserWithEmailAndPassword(email, password);

    signupForm.reset();
    $('#sign-up-modal').modal('hide');
}

const createGuideForm = document.querySelector('#create-guide-form');
createGuideForm.onsubmit = function (e) {
    e.preventDefault();
    const title = createGuideForm['create-guide-title'].value;
    const body = createGuideForm['create-guide-body'].value;
    db.collection('guides').add({ title, body });

    createGuideForm.reset();
    $('#create-guide-modal').modal('hide');
}

var dbDetacher;
auth.onAuthStateChanged(user => {
    if (user) {
        //show nav items
        document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
        document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');

        //listen to database
        dbDetacher = db.collection('guides').orderBy('title').onSnapshot(snapshot => {
            let html = '';
            snapshot.docs.forEach(doc => {
                html += `
                <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                            data-target="#${doc.id}">
                            ${doc.data().title}
                        </button>
                    </h2>
                </div>
        
                <div id="${doc.id}" class="collapse" data-parent="#guides-accordion">
                    <div class="card-body">
                        ${doc.data().body}
                    </div>
                </div>
            </div>
                `;
            });
            document.querySelector('#guides-accordion').innerHTML = html;
        })
    } else {
        //show nav items
        document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
        document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
        //detach database listener
        if (dbDetacher) dbDetacher();
        //empty guides list
        document.querySelector('#guides-accordion').innerHTML = '<h4 class="text-center">login to view game guides</h4>'
    }
})

