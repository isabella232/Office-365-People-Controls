(function () {
    "use strict";

    if (window.Type && window.Type.registerNamespace) {
        Type.registerNamespace('Office.Controls');
    } else {
        if (window.Office === undefined) {
            window.Office = {}; window.Office.namespace = true;
        }
        if (window.Office.Controls === undefined) {
            window.Office.Controls = {}; window.Office.Controls.namespace = true;
        }
    }

    /*
    *  The format of personaObject:
    * {
            "id": "person id",
            "imgSrc": "",
            "primaryText": 'Jerry Anderson',
            "secondaryText": 'Software Engineer, DepartmentA China', // JobTitle, Department
            "tertiaryText": 'BEIJING-Building1-1/XXX', // Office

            "actions":
                {
                    "email": "jerrya@companya.com",
                    "workPhone": "+86(10) 12345678", 
                    "mobile" : "+86 1861-0000-000",
                    "skype" : "jerrya@companya.com",
                }
            }
        };
    */
    Office.Controls.FacePile = function (root, personObjectArray, isShowEdit, numberOfDisplayedPerson, addPersonEventHandler, overflowEventHandler) {
        if (typeof root !== 'object' || typeof personObjectArray !== 'object') {
            Office.Controls.Utils.errorConsole('Invalid parameters type');
            return;
        }

        this.root = root;
        this.personObjectArray = personObjectArray;
        this.numberOfAllPerson = personObjectArray.length;
        this.isShowEdit = isShowEdit;
        if (numberOfDisplayedPerson !== null)
        { this.numberOfDisplayedPerson = numberOfDisplayedPerson; }

        if (addPersonEventHandler !== null)
        { this.addPersonEventHandler = addPersonEventHandler; }

        if (overflowEventHandler !== null)
        { this.overflowEventHandler = overflowEventHandler; }        
        
        this.renderControl();
    };

    Office.Controls.FacePile.prototype = {

        numberOfDisplayedPerson: 5,
        numberOfAllPerson: 0,
        isShowEdit: false,
        addPersonEventHandler: null,
        overflowEventHandler: null,

        renderControl: function () {
            this.root.innerHTML = Office.Controls.FacePile.Templates.generateFacePileContainerTemplate(this.personObjectArray, this.numberOfDisplayedPerson, this.isShowEdit);
           
            var membersElements = this.root.querySelectorAll('div.ms-FacePile-itemBtn--member');

            var nameImage = null;
            var showNodeQueue = [];

            for (var i = 0; i < membersElements.length; i++) {
                var ips = Office.Controls.Persona.PersonaHelper.createImageOnlyPersona(membersElements[i], this.personObjectArray[i], "click");
            }

            if (this.addPersonEventHandler !== null) {
                var addPersonElements = this.root.querySelector('button.js-addPerson');
                if (addPersonElements !== null) {
                    var self = this;
                    Office.Controls.Utils.addEventListener(addPersonElements, 'click', this.addPersonEventHandler);
                }
            }

            if (this.overflowEventHandler !== null) {
                var overflowElements = this.root.querySelector('button.js-overflowPanel');
                if (overflowElements !== null) {
                    var self = this;
                    Office.Controls.Utils.addEventListener(overflowElements, 'click', this.overflowEventHandler);
                }
            }
        },
        addPerson: function (personaObject) {

            /** Increment person count by one */
            this.numberOfAllPerson += 1;

            /** Display counter after numberOfDisplayedPerson people are present */
            if (this.numberOfAllPerson > this.numberOfDisplayedPerson) {
                this.root.querySelector(".ms-FacePile-itemBtn--overflow").className += " is-active";

                var remainingMembers = this.numberOfAllPerson - this.numberOfDisplayedPerson;
                this.root.querySelector(".ms-FacePile-overflowText").innerHTML = "+" + remainingMembers;

            }
            else {
                var node = document.createElement("div");
                node.title = personaObject.displayName;
                node.className = "ms-FacePile-itemBtn ms-FacePile-itemBtn--member";

                Office.Controls.Persona.PersonaHelper.createImageOnlyPersona(node, personaObject, "click");

                var memberListElements = this.root.querySelector('div.ms-FacePile-members');

                /** Add new item to members list in facepile */
                memberListElements.appendChild(node);
            }
        },

        removePerson: function (memberText) {
            this.numberOfAllPerson -= 1;

            /** Display counter after numberOfDisplayedPerson people are present */
            if (this.numberOfAllPerson > this.numberOfDisplayedPerson) {
                var remainingMembers = this.numberOfAllPerson - this.numberOfDisplayedPerson;
                this.root.querySelector(".ms-FacePile-overflowText").innerHTML = "+" + remainingMembers;
            }
            else if (this.numberOfAllPerson === this.numberOfDisplayedPerson) {
                this.root.querySelector(".ms-FacePile-itemBtn--overflow").className = "ms-FacePile-itemBtn ms-FacePile-itemBtn--overflow js-overflowPanel";
            }
            else{
                var facePileMember = this.root.querySelector("div.ms-FacePile-itemBtn--member,div[title=\"" + memberText + "\"]");
                facePileMember.parentNode.removeChild(facePileMember);
            }
        },
    };

    Office.Controls.FacePile.Templates = function () {
    }

    Office.Controls.FacePile.Templates.generateFacePileContainerTemplate = function (personaObjectArray, maxCount, showEdit) {
        var html = '<div class=\"ms-FacePile\">';
        if (showEdit) {
            html += '<button class=\"ms-FacePile-itemBtn ms-FacePile-itemBtn--addPerson js-addPerson\">';
            html += '<i class=\"ms-FacePile-addPersonIcon ms-Icon ms-Icon--personAdd\"></i>';
            html += '</button>';
        }

        html += '<div class=\"ms-FacePile-members\">';
        for (var i = 0; i < (maxCount > personaObjectArray.length ? personaObjectArray.length : maxCount) ; i++) {
            html += '<div title=\"' + personaObjectArray[i].displayName + '\" class=\"ms-FacePile-itemBtn ms-FacePile-itemBtn--member\">';
            html += '</div>';
        }

        html += '</div>';

        if (personaObjectArray.length > maxCount) {
            html += '<button class=\"ms-FacePile-itemBtn ms-FacePile-itemBtn--overflow js-overflowPanel is-active\">';
        }
        else {
            html += '<button class=\"ms-FacePile-itemBtn ms-FacePile-itemBtn--overflow js-overflowPanel\">';
        }

        var numberOfRemain = personaObjectArray.length - maxCount;
        html += '<span class=\"ms-FacePile-overflowText\">+' + numberOfRemain + '</span>';
        html += '</button>';

        html += '</div>';

        return html;
    };

    if (Office.Controls.FacePile.registerClass) { Office.Controls.FacePile.registerClass('Office.Controls.FacePile'); }
    if (Office.Controls.FacePile.Templates.registerClass) { Office.Controls.FacePile.Templates.registerClass('Office.Controls.FacePile.Templates'); }   

})();
