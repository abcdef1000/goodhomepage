// Initialize simpleMDE
var simplemde = new SimpleMDE({ 
	element: document.getElementById("sheet"),
	autofocus: true,
	spellChecker: false,
	toolbar: [],
	shortcuts:{
		"toggleUnorderedList": null,
	}
});

// Get localstorage notes
let notes = []
let txt = '';
let cur = 0;
let delState = false;

function setText(i){
	txt = notes[i];
	simplemde.value(txt);
}

//setting font
let val = localStorage.prevFont;
document.getElementsByClassName('CodeMirror')[0].style.fontFamily = val;
document.getElementsByTagName('Body')[0].style.fontFamily = val;

//setting text
if (localStorage.getItem("latest")){
	notes = JSON.parse(localStorage.notes);
	setText(localStorage.latest);
	cur = localStorage.latest;
}

console.log(notes);
let list= document.getElementById("notes");

document.getElementById("new").addEventListener("click", newNote);

function newNote(){
	let e = document.createElement("li");
	e.textContent = "new note...";
	list.appendChild(e);
	let newpos = notes.length;
	e.ind = newpos;
	notes.push('');
	e.addEventListener("click", changeNote);
	immediateSave();
	setText(newpos);
	cur = newpos;
	localStorage.latest = newpos;
}


function changeNote(evt){
	let i = Number(evt.currentTarget.ind);
	immediateSave();
	if (delState == false){
		setText(i);
		localStorage.latest = i;
		cur = i;
	}
	else {
		noteDiv.innerHTML = "";
		notes.splice(i, 1);
		generateList();
		if (cur == i){
			if (notes.length == 0){
				newNote();
			}
			else {
				setText(0);
				localStorage.latest = 0;
				cur = 0;
			}
		}
		else if (i < cur){
			cur = cur - 1;
		}
		localStorage.notes = JSON.stringify(notes);
		localStorage.latest = cur;
	}
}

// NOTES LIST
function generateList(){
	for (let i = 0; i < notes.length; i++){
		let e = document.createElement("li");
		e.textContent = notes[i].slice(0, Math.min(10, notes[i].length));
		list.appendChild(e);
		e.ind = i;
		e.addEventListener("click", changeNote);
	}
}
generateList();

// DELETING NOTES
let noteSection = document.getElementById("noteSection");
let delBut = document.getElementById("del");
delBut.addEventListener("click", function(){
	delState = !delState;
	if (delState){
		delBut.style.backgroundColor = "red";
		noteSection.setAttribute("class", "delOn");
	}
	else {
		delBut.style.backgroundColor = "black";
		noteSection.setAttribute("class", "");
	}
});

// saving to text
var t; // prevent oversaving
function saveToTxt() {
	console.log("hello");
	clearTimeout(t);
	t = setTimeout(function(){
		immediateSave();
	}, 500);
}

let noteDiv = document.getElementById("notes");
function immediateSave(){
	let val = simplemde.value();
	console.log(val);
	cur = Number(cur);
	notes[cur] = val;
	console.log(cur);
	console.log(noteDiv.children.length);
	console.log(noteDiv.children.item(cur));

	noteDiv.children.item(cur).textContent = notes[cur].slice(0, Math.min(10, notes[cur].length));
	localStorage.setItem('notes', JSON.stringify(notes));
	console.log("saving");
	console.log(localStorage.notes);
}

simplemde.codemirror.on("change", function(){
	saveToTxt();
});


// FONT CHANGING 
document.getElementById("box").addEventListener("keydown",
function(event) {
	//if (!event) {var event = window.event;}
	//event.preventDefault();
	if (event.keyCode == 13){
		change();
	}
}, false);
function change(){
	let val = document.getElementById("box").value;
	console.log("changing")
	console.log(val);
	localStorage.prevFont = val;
	document.getElementsByClassName('CodeMirror')[0].style.fontFamily = val;
	document.getElementsByTagName('Body')[0].style.fontFamily = val;
}
