$(document).ready(function () {

    var characters = [];
    var characterChoosen = false;
    var hostCharacter = {};
    var currentDefender = {};

    initGame();

    function initGame() {
        characterChoosen = false;
        hostCharacter = {};
        currentDefender = {};
        characters.push(createCharacter('darth', 'Darth Vader', 200, 12, 24));
        characters.push(createCharacter('luke', 'Luke Skywalker', 220, 9, 18));
        characters.push(createCharacter('leia', 'Leia', 160, 6, 12));
        characters.push(createCharacter('obi', 'Obi-Wan Kenobi', 190, 5, 10));
        createSectionMessage('chooseCharacterDiv', 'Pick your fight character','12');
        drawCharacters('chooseCharacterDiv', characters);
    }

    function drawCharacters(divName, array) {
        array.forEach(character => {
            character.createHtml(divName);
        });
    }

    function createSectionMessage(divName, message, size){
        var currentDiv = $('#' + divName);
        var messageDiv = $('<div class="row text-center">');
        var messageColumn = $(`<div class="col-md-${size} col-sm-${size} col-${size}">`);
        var messageElement = $('<h3>');
        messageElement.text(message);
        messageColumn.append(messageElement);
        messageDiv.append(messageColumn);
        messageDiv.insertBefore(currentDiv);
    }

    function handleCharacterClick(characterId) {
        if (!characterChoosen) {
            hostCharacter = getSelectedCharacter(characterId);
            characterChoosen = true;
            characters = removeFromArray(hostCharacter.id, characters);
            unDrawCharacters('chooseCharacterDiv');
            createSectionMessage('chosenCharacterDiv','Your character','6');
            hostCharacter.createHtml('chosenCharacterDiv');
            removeClickHandler(hostCharacter.id);
            createSectionMessage('enemiesDiv','Enemies available to attack','9');
            drawCharacters('enemiesDiv', characters);
        } else {
            currentDefender = getSelectedCharacter(characterId);
            characters = removeFromArray(currentDefender.id, characters);
            unDrawCharacters('enemiesDiv');
            createSectionMessage('defenderDiv','The Defender','6');
            currentDefender.createHtml('defenderDiv');
            removeClickHandler(currentDefender.id);
            createFightArea();
        }
    }

    function createFightArea () { 
        var fightDiv = $('#fightDiv');
        var attackColumn = $('<div class="col-md-6 col-sm-6 col-6 text-center">')
        var attackButton = $('<button type="button" class="btn btn-danger">');
        attackButton.text('Attack!');
        attackColumn.append(attackButton);
        fightDiv.append(attackColumn);
        
    }

    function removeClickHandler(characterId){
        $('#'+ characterId + " img").unbind("click");
    }
    
    function removeFromArray(id, array) {
        return array.filter(elem => {
            return elem.id !== id;
        })
    }

    function unDrawCharacters(divName) {
        $('#' + divName).prev().empty();
        $('#' + divName).empty();
    }

    function getSelectedCharacter(characterId) {
        return characters.filter(character => {
            return character.id === characterId;
        })[0];
    }

    function createCharacter(id, name, hp, attack, counterAttack) {
        return {
            id,
            name,
            image: './assets/images/' + id + '.png',
            hp,
            baseAttack: attack,
            currentAttack: attack,
            counterAttack,
            createHtml: function (divName) {
                var chooseCharacterDiv = $('#' + divName);
                var characterColumn = $('<div class="col-sm-6 col-md-3 col-6">');
                var characterCard = $('<div class="charater_card">');
                characterCard.attr('id', this.id);
                var characterImage = $('<img>');
                characterImage.attr('src', './assets/images/' + this.id + '.png');
                characterImage.attr('class', 'character_img');
                var characterBody = $('<div class="character_card_body">');
                var characterTitle = $('<h5 class="character_card_title">');
                var characterText = $('<p class="character_card-text">');
                characterTitle.text(this.name);
                characterText.text('HP: ' + this.hp);
                characterCard.append(characterImage);
                characterBody.append(characterTitle);
                characterBody.append(characterText);
                characterCard.append(characterBody);
                characterColumn.append(characterCard);
                chooseCharacterDiv.append(characterColumn);
                characterImage.on('click', () => handleCharacterClick(this.id));
            }
        };
    }
})