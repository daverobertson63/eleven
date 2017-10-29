
import React, { Component } from 'react';
import update from 'immutability-helper';
import NextCard from '../components/NextCard';
import DealInterface from '../components/DealInterface';
import Status from '../components/Status';
import Foundation from '../components/Foundation';
import Target from '../components/Target';


class App extends Component {
    constructor() {
        super();
        const deck = shuffle(deckValues.slice());
        // Applicaton end to end state
        this.state = {
            gameOver:false,
            deck: deck,
            nextCard: deck.shift(),
            foundations: Array(9).fill([]),   // Holds the state of all the cards - data model
            targets: Array(9).fill(null),
            focusedFoundation: null,
            nextCardFocused: true,
            lastMove: null,
            deckLocation:0, // Location being dealt - so where to deal thenext card
            boardDealt:0  // Numbers actually dealt onto the board
        };
    }

    render() {
        const foundationComponents = [];
        const targetComponents = [];

        console.log("Change of state - rendering main app");


        // Get the details of the 9 cards from the data model based in the state Array - this.state.foundations
        for (let i = 0; i < 9; i++) {
            const foundationCards = this.state.foundations[i];

            //console.log(foundationCards);

            foundationComponents.push(
                <Foundation
                    cards={foundationCards}
                    onFocus={() => this.onFoundationFocus(i)}
                    autofocus={this.state.focusedFoundation === i}
                    ondealclick={() => this.onBoardClick(i)}
                />
            );

        }

        const divStyle = {
            maxWidth: "600px",
            border: "0px solid black"
        };

        const divStyle2 = {
            maxWidth: "600px",
            border: "0px solid black"
        };


        var cardObj=this.state.nextCard;
        //this.state.nextCardFocused=true;
        //console.log( "CardObject: " + cardObj.f );

        // Fully render the application and all components
        return (

            <div style={{margin: "auto", maxWidth: "800px" ,border: "2px solid black", tabIndex:"0"}}   onKeyPress={(e) => this.onKeyPress(e)} >

              <div>
                <div style={{display: "inline-block" ,border: "2px solid black"}} >


                  <NextCard cardObj={this.state.nextCard} onFocus={() => this.onNextCardFocus()} autofocus={this.state.nextCardFocused}  onClick={(e) => this.onNextCardClick(e)} />

                </div>
                <div style={{paddingLeft: "10px", display: "inline-block" ,border: "2px solid black"}  } >
                  <h3>Dave's Eleven Card Game in React</h3>
                  <ul>
                    <li>Click on the deck to deal a card and place on the table in sequence to 1 to 9</li>
                    <li>If two cards add up to ELEVEN you can place two cards from the deck</li>
                    <li>If you have Jack, Queen or King you can place all three</li>
                    <li>You need to get all cards out!</li>
                  </ul>
                  Good luck!
                </div>
              </div>
              <Status deckSize={this.state.deck.length} victory={this.isWin()} />


              <div style={divStyle}>
                  {foundationComponents}
              </div>

              <DealInterface
                  onDealClick={(i) => this.onDealClick(i)}
                  onTargetClick={(i) => this.onTargetClick(i)}
                  onUndoClick={() => this.onUndoClick()}
                  onResetClick={() => this.onResetClick()}
                  foundationsDisabled={!(this.state.nextCardFocused && this.state.nextCard)}
                  disabledStatuses={[0,1,2,3].map((i) => !this.canSendToTarget(i))}
                  undoDisabled={this.state.lastMove === null}
              />


            </div>
        );
    }

    saveScore()
    {

        var score = 0;
        var highscore = localStorage.getItem("highscore");

        if(highscore !== null){
            if (score > highscore) {
                localStorage.setItem("highscore", score);
            }
        }
        else{
            localStorage.setItem("highscore", score);
        }

    }

    onKeyPress(e) {

        //console.log(e.key);


        if (e.key === '`') {
            this.setState({
                focusedFoundation: null,
                nextCardFocused: true
            });
        } else if (['1','2','3','4'].includes(e.key)) {
            this.setState({
                focusedFoundation: parseInt(e.key, 10) - 1,
                nextCardFocused: false
            });
        } else if (this.state.nextCardFocused && ['q', 'w', 'e', 'r'].includes(e.key)) {
            this.onFoundationClick({ q: 0, w: 1, e: 2, r: 3 }[e.key]);
        } else if (['a', 's', 'd', 'f'].includes(e.key)) {
            const targetNum = { a: 0, s: 1, d: 2, f: 3}[e.key];
            if (this.canSendToTarget(targetNum)) {
                this.onTargetClick(targetNum);
            }
        }
    }

    isWin() {

        return false;
        for (let i = 0; i < this.state.targets.length; i++) {
            const target = this.state.targets[i];
            if (!target || target.v < 13) {
                return false;
            }
        }

        return true;
    }

    // Check to see if there is a valid 3 available for the player
    isValidThree()
    {
        console.log("Valid 3 Check");

        for (let i = 0; i < 9; i++) {
            const foundationCard = this.state.foundations[i];
            console.log("card: " + i);
            console.log(foundationCard);
            if (foundationCard.length == 1) {
                console.log(foundationCard.length);
                const topCard = foundationCard[0];
                console.log(topCard.v);
            }

        }


    }


    onFoundationFocus(i) {

        console.log("Board Card has new Focus");
        console.log(i);

        //return;
        this.setState({
            nextCardFocused: false,
            focusedFoundation: i
        });
    }

    onNextCardFocus() {

        //console.log("Focus on nextcard deck");
        this.setState({
            nextCardFocused: true,
            focusedFoundation: null
        });
    }

    // One of the cars already dealt on the board is clicked.  So we can add a new one
    onBoardClick(i)
    {

        console.log("Card from board clicked");
        console.log(i);

        const boardDealt = i;

        const deck = this.state.deck.slice();
        // get the next card from the deck
        const nextCard = deck.shift();

        // add it to the board - in the correct location - for now the one that was clicked
        // Unlimited it seems - we can push the
        const foundations = update(this.state.foundations, {[boardDealt]: {$push: [this.state.nextCard]}});

        this.setState({

            deck: deck,
            nextCard: nextCard,
            foundations: foundations,
            lastMove: {
                deck: this.state.deck,
                nextCard: this.state.nextCard,
                foundations: this.state.foundations,
                targets: this.state.targets,
            }
        });


    }




    onDealFromDeckClick(i) {

        this.onDealClick(i);

    }

// Deal the card from the deck to the next available location using the deal button - or the deck itself

    onDealClick(i) {



        if (!this.state.nextCardFocused) {
            console.log("Deck not in focus");

            console.log(i);
            this.isValidThree();
            return;
        }

        if (this.state.boardDealt === 9 )
        {

            console.log("Board has no more places to deal");
            return;

        }

        //return;



        const gameOver=false;

        const boardDealt = this.state.boardDealt;

        const deck = this.state.deck.slice();
        // get the next card from the deck
        const nextCard = deck.shift();

        // add it to the board - in the correct location - for now the one that was clicked
        // Unlimited it seems - we can push the
        const foundations = update(this.state.foundations, {[boardDealt]: {$push: [this.state.nextCard]}});

        this.setState({
            boardDealt:boardDealt+1,
            gameOver:gameOver,
            deck: deck,
            nextCard: nextCard,
            foundations: foundations,
            lastMove: {
                deck: this.state.deck,
                nextCard: this.state.nextCard,
                foundations: this.state.foundations,
                targets: this.state.targets,
            }
        });



    }



// So now we take one card from the deck set to the deck
    onNextCardClick(i) {

        console.log(i);

        this.onDealFromDeckClick(i);

        return;

        if (this.state.deckLocation === 8 )
        {
            this.state.deckLocation=0;

        }
        else
        {
            this.state.deckLocation++;
        }

        if (!this.state.nextCardFocused) {
            return;
        }
        console.log(this.state.deckLocation);
        return;

        const deck = this.state.deck.slice();
        const nextCard = deck.shift();
        const foundations = update(this.state.foundations, {[i]: {$push: [ this.state.nextCard ]}});

        this.setState({
            deck: deck,
            nextCard: nextCard,
            foundations: foundations,
            lastMove: {
                deck: this.state.deck,
                nextCard: this.state.nextCard,
                foundations: this.state.foundations,
                targets: this.state.targets,
            }
        });
    }

    onTargetClick(i) {
        if (!this.canSendToTarget(i)) {
            return;
        }

        const targets = update(this.state.targets, {[i]: {$set: this.focusedCard()}});
        const stateChange = {
            targets: targets,
            lastMove: {
                deck: this.state.deck,
                nextCard: this.state.nextCard,
                foundations: this.state.foundations,
                targets: this.state.targets,
            }
        };
        if (this.state.nextCardFocused) {
            const deck = this.state.deck.slice();
            const nextCard = deck.shift();

            stateChange["deck"] = deck;
            stateChange["nextCard"] = nextCard;
        } else {
            const foundationLength = this.state.foundations[this.state.focusedFoundation].length - 1
            const foundations = update(this.state.foundations, {[this.state.focusedFoundation]: {$splice: [[foundationLength]]}});
            stateChange["foundations"] = foundations;
            if (foundationLength === 0) {
                stateChange["nextCardFocused"] = true;
                stateChange["focusedFoundation"] = null;
            }
        }

        stateChange["targets"] = targets;

        this.setState(stateChange);
    }

    onUndoClick() {
        if (this.state.lastMove === null) {
            return;
        }

        this.setState({
            deck: this.state.lastMove.deck,
            nextCard: this.state.lastMove.nextCard,
            foundations: this.state.lastMove.foundations,
            targets: this.state.lastMove.targets,
            focusedFoundation: null,
            nextCardFocused: true,
            lastMove: null
        });
    }

// Reset the deck and rebuilt everything

    onResetClick() {


        const deck = shuffle(deckValues.slice());
        this.setState({
            gameOver:false,
            deckLocation:0,
            boardDealt:0,
            deck: deck,
            nextCard: deck.shift(),
            foundations: Array(9).fill([]),
            targets: Array(9).fill(null),
            focusedFoundation: null,
            nextCardFocused: true,
            lastMove: {
                deck: this.state.deck,
                nextCard: this.state.nextCard,
                foundations: this.state.foundations,
                targets: this.state.targets,
            }
        });
    }

    canSendToTarget(i) {
        const card = this.focusedCard();
        if (!card) {
            return false;
        }

        const targetValue = this.state.targets[i] ? this.state.targets[i].v : 0;
        return (targetValue < 13) && (card.v % 13 === (targetValue + (i + 1)) % 13);
    }

    focusedCard() {
        if (this.state.nextCardFocused) {
            return this.state.nextCard;
        }

        const foundation = this.state.foundations[this.state.focusedFoundation];
        return foundation[foundation.length-1];
    }
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const deckValues = Object.freeze([
    {v:1,f:"ca"},{v:2,f:"c2"},{v:3,f:"c3"},{v:4,f:"c4"},{v:5,f:"c5"},{v:6,f:"c6"},
    {v:7,f:"c7"},{v:8,f:"c8"},{v:9,f:"c9"},{v:10,f:"c10"},{v:11,f:"cj"},{v:12,f:"cq"},{v:13,f:"ck"},
    {v:1,f:"ha"},{v:2,f:"h2"},{v:3,f:"h3"},{v:4,f:"h4"},{v:5,f:"h5"},{v:6,f:"h6"},
    {v:7,f:"h7"},{v:8,f:"h8"},{v:9,f:"h9"},{v:10,f:"h10"},{v:11,f:"hj"},{v:12,f:"hq"},{v:13,f:"hk"},
    {v:1,f:"sa"},{v:2,f:"s2"},{v:3,f:"s3"},{v:4,f:"s4"},{v:5,f:"s5"},{v:6,f:"s6"},
    {v:7,f:"s7"},{v:8,f:"s8"},{v:9,f:"s9"},{v:10,f:"s10"},{v:11,f:"sj"},{v:12,f:"sq"},{v:13,f:"sk"},
    {v:1,f:"da"},{v:2,f:"d2"},{v:3,f:"d3"},{v:4,f:"d4"},{v:5,f:"d5"},{v:6,f:"d6"},
    {v:7,f:"d7"},{v:8,f:"d8"},{v:9,f:"d9"},{v:10,f:"d10"},{v:11,f:"dj"},{v:12,f:"dq"},{v:13,f:"dk"}
]);

export default App;
