// ==UserScript==
// @name          Scroll to Trello list
// @description   Automatically scroll to the specified Trello-board list
// @author        Vassyutovich Ilya (https://github.com/VassyutovichIlya)
// @homepageURL   https://github.com/VassyutovichIlya/user-scripts
// @license       MIT
// @version       0.1.0
// @grant         none
// @include       https://trello.com/*
// ==/UserScript==

console.debug("user-script started");

const listNameParameterName = "scrollToList";
const scriptExecutionTimeoutSeconds = 10;

const uriParams = new URLSearchParams(window.location.search);
const listName = uriParams.get(listNameParameterName);

if (listName == null) {
	console.debug("list name not found in query string");
	return;
}
console.debug(`list name found in query string — "${listName}"`);

let executionTimedOut = false;
const executionTimeoutTimer = setTimeout(
	() => executionTimedOut = true,
	scriptExecutionTimeoutSeconds * 1000
);

const mutator = async (_, observer) => {
	console.debug("observed mutations");

	if (executionTimedOut) {
		console.debug("execution timed out");
		clearTimeout(executionTimeoutTimer);
		console.debug("stopping observer");
		observer.disconnect();
		console.debug("observer stopped");
		return;
	}

	const trelloRootElement = document.getElementById("trello-root");
	if (trelloRootElement == null) {
		console.debug("trello-root not found");
		return;
	}

	const trelloContentElement = document.getElementById("content");
	if (trelloContentElement == null) {
		console.debug("trello-content not found");
		return;
	}

	const trelloBoardElement = document.getElementById("board");
	if (trelloBoardElement == null) {
		console.debug("trello-board not found");
		return;
	}

	const listsTextAreas = Array.from(
		document
			.querySelectorAll("div .list-header textarea"));
	const foundList = listsTextAreas.find(textArea => textArea.value === listName);
	if (foundList === undefined) {
		console.debug("list not found (yet?)");
		return;
	}
	console.debug("list found");

	console.debug("stopping observer");
	observer.disconnect();
	console.debug("observer stopped");

	const scrollOptions = { "inline": "center" };
	foundList.scrollIntoView(scrollOptions);
	console.debug("scrolled to list");
}

console.debug("starting observer");
const mutationObserver = new MutationObserver(mutator);
mutationObserver.observe(document, { childList: true, subtree: true });
console.debug("observer started");

console.debug("user-script stopped (execution may continue asynchronously)");
