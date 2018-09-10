$(document).ready(function () {

    var characters = [];
    var characterChoosen = false;
    var hostCharacter, currentDefender = {};

    function initGame() {
        restartGameState();
        createCharactersArray();
        cleanDivs();
        drawCharacters('chooseCharacterDiv', 'Pick your fight character', characters);
    }

    function cleanDivs() {
        $('.row').empty();
    }

    function restartGameState() {
        characters = [];
        characterChoosen = false;
        hostCharacter, currentDefender = {};
    }

    function createCharactersArray() {
        characters.push(createCharacter('darth', 'Darth Vader', 200, 16, 24));
        characters.push(createCharacter('luke', 'Luke Skywalker', 220, 17, 18));
        characters.push(createCharacter('leia', 'Leia', 160, 2, 12));
        characters.push(createCharacter('obi', 'Obi-Wan Kenobi', 190, 15, 10));
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
            createHtml: function (divName, sm = '4', m = '4', xs = '6') {
                $('#' + divName)
                    .append($(`<div class="col-sm-${sm} col-md-${m} col-${xs}">`)
                        .append($('<div class="charater_card">')
                            .attr('id', this.id)
                            .append($('<img>')
                                .attr('src', './assets/images/' + this.id + '.png')
                                .attr('class', 'character_img')
                                .on('click', () => handleCharacterClick(this.id)))
                            .append($('<div class="character_card_body">')
                                .append($('<h5 class="character_card_title">')
                                    .text(this.name))
                                .append($('<p class="character_card-text">')
                                    .text('HP: ' + this.hp)))));
            }
        };
    }


    function createSectionTitle(divName, title, size) {
        $('<div class="row text-center">')
            .append($(`<div class="col-md-${size} col-sm-${size} col-${size}">`)
                .append($('<h3>')
                    .text(title))).insertBefore($('#' + divName));
    }

    function drawCharacters(divName, title, array) {
        createSectionTitle(divName, title, '12');
        array.forEach(character => {
            character.createHtml(divName);
        });
    }

    function unDrawCharacters(divName) {
        cleanDivAndTitle(divName);
    }

    function cleanDivAndTitle(divName) {
        $('#' + divName).prev().empty();
        cleanDiv(divName);
    }

    function handleCharacterClick(characterId) {
        var character = getSelectedCharacter(characterId);
        if (!characterChoosen) {
            hostCharacter = character;
            chosenCharacterActions(character);
            characterChoosen = true;
            drawEnemies();
        } else {
            currentDefender = character;
            chosenCharacterActions(character);
            createFightArea();
        }
    }

    function drawEnemies(){
        drawCharacters('enemiesDiv','Enemies available to atack', characters);
    }

    function chosenCharacterActions(character) {
        characters = removeFromArray(character.id, characters);
        const { divToDissapear, divToShow, sectionTitle } = getChosenProperties();
        unDrawCharacters(divToDissapear);
        createSectionTitle(divToShow, sectionTitle, '12');
        character.createHtml(divToShow, '12', '12', '12');
        removeClickHandler(`#${character.id} img`);
    }

    function getChosenProperties() {
        return characterChoosen ? {
            divToDissapear: 'enemiesDiv',
            divToShow: 'defenderDiv',
            sectionTitle: 'The Defender'
        } : {
                divToDissapear: 'chooseCharacterDiv',
                divToShow: 'chosenCharacterDiv',
                sectionTitle: 'Your character'
            }
    }

    function createFightArea() {
        var fightDiv = $('#fightDiv')
            .append($('<div class="col-md-12 col-sm-12 col-12">')
                .append($('<button id="attackButton" type="button" class="btn btn-danger">')
                    .text('Attack!')).on('click', () => attack()));
    }

    function getSelectedCharacter(characterId) {
        return characters.filter(character => character.id === characterId)[0];
    }

    function removeClickHandler(selector) {
        $(selector).unbind("click");
    }

    function removeFromArray(id, array) {
        return array.filter(elem =>  elem.id !== id);
    }

    function updateScreenAfterAttack() {
        updateDisplayHp(hostCharacter);
        updateDisplayHp(currentDefender);
        displayAttackStatus();
    }

    function displayAttackStatus() {
        cleanDiv('attackStatusDiv');
        $('#attackStatusDiv').append($('<div class="col-md-12 col-sm-12 col-12">')
            .append($('<h5>')
                .text(`You attacked ${currentDefender.name} for ${hostCharacter.currentAttack - hostCharacter.baseAttack} damage`))
            .append($('<h5>')
                .text(`${currentDefender.name} attacked you back for ${currentDefender.counterAttack} damage`)));
    }

    function cleanDiv(divName) {
        $('#' + divName).empty();
    }

    function updateDisplayHp(character) {
        $('#' + character.id + ' .character_card-text').text(`HP: ${character.hp}`);
    }

    function attackOperations() {
        currentDefender.hp -= hostCharacter.currentAttack;
        hostCharacter.currentAttack += hostCharacter.baseAttack;
        hostCharacter.hp -= currentDefender.counterAttack;
    }

    function resultActions(divName, message, remainingEnemies) {
        cleanDiv('attackStatusDiv');
        cleanDiv('fightDiv');
        displayResultElements(divName, message, remainingEnemies);
    }

    function displayResultElements(divName, message, remainingEnemies) {
        $(`#${divName}`)
            .append($('<div class="col-md-12 col-sm-12 col-12">')
                .append($('<h6>').text(message))
                .append(createContinueGameButton(remainingEnemies)));
    }

    function displayNextEnemies() {
        cleanDivAndTitle('defenderDiv');
        cleanDiv('winDiv');
        drawEnemies();
    }

    function createContinueGameButton(remainingEnemies) {
        return $('<button type="button" class="btn btn-info">')
            .text(remainingEnemies ? 'Next Enemy' : 'Restart')
            .on('click', () => remainingEnemies ? displayNextEnemies() : initGame());
    }

    function attack() {
        attackOperations();
        updateScreenAfterAttack();
        if (currentDefender.hp <= 0) {
            resultActions('winDiv', 'You win!', characters.length > 0)
        } else if (hostCharacter.hp <= 0) {
            resultActions('looseDiv', 'You loose!', false);
        }
    }

    initGame();
})