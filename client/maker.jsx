const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Delete a domo by ID
const deleteDomo = async (id, triggerReload) => {
    const csrfToken = window.csrfToken;

    await fetch('/deleteDomo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, _csrf: csrfToken }),
    });

    triggerReload(); // refresh domo list
};

// Handle new domo form submission
const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;

    if (!name || !age || !level) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, level, _csrf: window.csrfToken }, onDomoAdded);
    return false;
};

// Domo creation form
const DomoForm = (props) => {
    return (
        <form
            id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <input type="hidden" id="_csrf" name="_csrf" value={window.csrfToken} />

            <span style={{ marginRight: '10px' }}>
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            </span>

            <span style={{ marginRight: '10px' }}>
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="number" min="0" name="age" />
            </span>

            <span style={{ marginRight: '10px' }}>
                <label htmlFor="level">Level: </label>
                <input id="domoLevel" type="number" min="1" name="level" />
            </span>

            <span>
                <input className="makeDomoSubmit" type="submit" value="Make Domo" />
            </span>
        </form>
    );
};




// List of domos
const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map((domo) => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>

                <button className="deleteButton" onClick={() => deleteDomo(domo._id, props.triggerReload)}>
                    Delete
                </button>
            </div>
        );
    });

    return <div className="domoList">{domoNodes}</div>;
};

// Main App
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>

            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

// Initialize React
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
