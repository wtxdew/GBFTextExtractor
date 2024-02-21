// ==UserScript==
// @name        Granblue Fantasy scene text Extractor
// @namespace   Tampermonkey Scripts
// @match       *://game.granbluefantasy.jp/*
// @match       *://gbf.game.mbga.jp/*
// @grant       GM_log
// @grant       GM_setClipboard
// @version     2.0
// @author      wtxdew
// @description This userscript extracts text content from story scenes in Granblue Fantasy and copies it to the clipboard. It provides notifications through both browser notifications and visual cues when text extraction occurs. Additionally, it allows triggering text extraction with a keyboard shortcut or by clicking on the story interface.
// ==/UserScript==
// debugger;

(function() {
    'use strict';
    // Function to copy text to clipboard
    function copyToClipboard(text) {
        GM_setClipboard(text);
        GM_log("Text copied to clipboard:", text);
    }

	function notifyText() {
		// Add notification
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('Text Extracted', {
				body: 'Text has been copied to clipboard.'
			});
		} else if ('Notification' in window && Notification.permission !== 'denied') {
			Notification.requestPermission().then(function(permission) {
				if (permission === 'granted') {
					new Notification('Text Extracted', {
						body: 'Text has been copied to clipboard.'
					});
				}
			});
		} else {
			// Fallback for browsers that do not support Notifications or where permissions are denied
			alert('Text has been copied to clipboard.');
		}
	}

	function notifyVisual(messageBlock) {
        // Add visual notification
        messageBlock.style.transition = 'background-color 0.5s';
        messageBlock.style.backgroundColor = 'yellow';
        setTimeout(() => {
        messageBlock.style.backgroundColor = '';
        }, 500); // Change to desired duration (in milliseconds)
	}

    // Function to extract text content from the specific block
    function extractText() {
        var messageBlock = document.querySelector('.prt-message-area .txt-message');
        if (messageBlock) {
            var textContent = messageBlock.textContent.trim();
            copyToClipboard(textContent);
			notifyVisual(messageBlock);
        }
    }

    function setupTextExtraction() {
        const targetNode = document.querySelector('.ico-cursor-talk');
        if (!targetNode) return; // Exit if the target node is not found
        // If the initial style is already 'block', extract text immediately
        if (targetNode.style.display === 'block') {
            extractText();
            return;
        }
        const observer = new MutationObserver(() => {
            if (targetNode.style.display === 'block') {
                observer.disconnect(); // Stop observing once the style changes to 'block'
                extractText();
			}
        });
        observer.observe(targetNode, { attributes: true, attributeFilter: ['style'] });
    }

    document.addEventListener('keydown', function(event) {
		if(event.key == " ") {
			setupTextExtraction()
		}
    });

	const contentArea = document.querySelector('.contents');
	contentArea.addEventListener('click', function(event){
            extractText();
		const targetNode = document.querySelector('.ico-cursor-talk');
		if (targetNode.style.display === 'block') {
        }
	});
})();
