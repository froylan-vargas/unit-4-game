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
            createSectionMessage('chosenCharacterDiv','Your character','12');
            hostCharacter.createHtml('chosenCharacterDiv','12','12','12');
            removeClickHandler(hostCharacter.id);
            createSectionMessage('enemiesDiv','Enemies available to attack','12');
            drawCharacters('enemiesDiv', characters);
        } else {
            currentDefender = getSelectedCharacter(characterId);
            characters = removeFromArray(currentDefender.id, characters);
            unDrawCharacters('enemiesDiv');
            createSectionMessage('defenderDiv','The Defender','12');
            currentDefender.createHtml('defenderDiv','12','12','12');
            characters = removeFromArray(currentDefender.id, characters);
            console.log(characters);
            removeClickHandler(currentDefender.id);
            createFightArea();
        }
    }

    function createFightArea () { 
        var fightDiv = $('#fightDiv');
        var attackColumn = $('<div class="col-md-12 col-sm-12 col-12">')
        var attackButton = $('<button type="button" class="btn btn-danger">');
        attackButton.text('Attack!');
        attackColumn.append(attackButton);
        fightDiv.append(attackColumn);
        attackButton.on('click', ()=> attack());
    }

    function attack(){
        console.log('defender hp', currentDefender.hp);
        console.log('host current atack', hostCharacter.currentAttack);
        console.log('host hp', hostCharacter.hp);
        currentDefender.hp -= hostCharacter.currentAttack;
        hostCharacter.currentAttack += hostCharacter.baseAttack;
        hostCharacter.hp -= currentDefender.counterAttack;
        console.log('*********************************');
        console.log('defender hp', currentDefender.hp);
        console.log('host current atack', hostCharacter.currentAttack);
        console.log('host hp', hostCharacter.hp);
        console.log('-------------------------------');

        //Refresh new hp on screen.
        

        if(currentDefender.hp <= 0){
            /*Logic you win
            //Message of win
            //Check if there are more enemies available
            //Clean fight area and defenderDiv
            //Show available enemies if its the case
            //If not, restart the game from the beginning
            */
        } else if (hostCharacter.hp <= 0) {
            /*Logic you loose
            //Message of loose
            //Restart the game from the beginning
            */
        }
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
            createHtml: function (divName, sm='4', m='4', xs='6') {
                var chooseCharacterDiv = $('#' + divName);
                var characterColumn = $(`<div class="col-sm-${sm} col-md-${m} col-${xs}">`);
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