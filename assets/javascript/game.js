$(document).ready(function () {

    var characters = [];
    var characterChoosen = false;
    var hostCharacter = {};
    var currentDefender = {};

    function initGame() {
        restartGameState();
        createCharactersArray();
        cleanDivs();
        createSectionTitle('chooseCharacterDiv', 'Pick your fight character', '12');
        drawCharacters('chooseCharacterDiv', characters);
    }

    function cleanDivs(){
        $('.row').empty();
    }

    function restartGameState() {
        characters = [];
        characterChoosen = false;
        hostCharacter = {};
        currentDefender = {};
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


    function createSectionTitle(divName, message, size) {
        $('<div class="row text-center">')
            .append($(`<div class="col-md-${size} col-sm-${size} col-${size}">`)
                .append($('<h3>')
                    .text(message))).insertBefore($('#' + divName));
    }

    function drawCharacters(divName, array) {
        array.forEach(character => {
            character.createHtml(divName);
        });
    }

    function unDrawCharacters(divName) {
        $('#' + divName).prev().empty();
        $('#' + divName).empty();
    }

    function handleCharacterClick(characterId) {
        var character = getSelectedCharacter(characterId);
        if (!characterChoosen) {
            hostCharacter = character;
            chosenCharacterActions(character);
            characterChoosen = true;
            createSectionTitle('enemiesDiv', 'Enemies available to attack', '12');
            drawCharacters('enemiesDiv', characters);
        } else {
            currentDefender = character;
            chosenCharacterActions(character);
            createFightArea();
        }
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
        return characters.filter(character => {
            return character.id === characterId;
        })[0];
    }

    function removeClickHandler(selector) {
        $(selector).unbind("click");
    }

    function removeFromArray(id, array) {
        return array.filter(elem => {
            return elem.id !== id;
        })
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

    function cleanDiv(divName){
        $('#' + divName).empty();
    }

    function updateDisplayHp(character) {
        $('#' + character.id + ' .character_card-text').text(character.hp);
    }

    function attackOperations() {
        currentDefender.hp -= hostCharacter.currentAttack;
        hostCharacter.currentAttack += hostCharacter.baseAttack;
        hostCharacter.hp -= currentDefender.counterAttack;
    }

    function looseActions(){
        cleanDiv('attackStatusDiv');
        cleanDiv('fightDiv');
        displayLooseElements();
    }

    function displayLooseElements(){
        $('#looseDiv')
            .append($('<div class="col-md-12 col-sm-12 col-12">')
                .append($('<h6>').text('You loose!'))
                .append(createRestartButton()));
    }

    function createRestartButton(){
        return $('<button type="button" class="btn btn-info">')
        .text('Restart')
        .on('click', () => initGame());
    }

    function attack() {
        attackOperations();
        updateScreenAfterAttack();

        if (currentDefender.hp <= 0) {
            /*Logic you win
            //Message of win
            //Check if there are more enemies available
            //Clean fight area and defenderDiv
            //Show available enemies if its the case
            //If not, restart the game from the beginning
            */
        } else if (hostCharacter.hp <= 0) {
            looseActions();
        }
    }

    initGame();
})