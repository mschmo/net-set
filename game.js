var m = require('mori');
var set = require('./setLogic.js');

// map{'dealt': <card sequence>,
//     'undealt': <card sequence>,
//     'players': map{<name>: map{'score': <int>,
//                                'claimed': <card sequence>}
//                   }
// }

exports.getInitialState = function() {
    var deck = set.makeDeck();
    var dealt = m.take(12, deck);
    var undealt = m.drop(12, deck);
    var players = m.hashMap();
    var gameState = m.hashMap('dealt', dealt, 'undealt', undealt, 'players', players);
    return gameState;
}

function deal(n, gameState) {
    //TODO
    return gameState;
}

exports.addPlayer = function(name, oldState) {
    return m.assocIn(oldState, ['players', name], m.hashMap('score', 0, 'claimed', m.set()));
}

exports.removePlayer = function(name, oldState) {
    var newPlayers = m.dissoc(m.get(oldState, 'players'), name)
    return m.assoc(oldState, 'players', newPlayers);
}

exports.claimCard = function(player, cardID, oldState) {
    var card = m.nth(m.get(oldState, 'dealt'), Number(cardID));
    var oldClaimed = m.getIn(oldState, ['players', player, 'claimed']);
    var newClaimed = m.conj(oldClaimed, card);
    return m.assocIn(oldState, ['players', player, 'claimed'], newClaimed);
}

exports.playerHasCandidate = function(player, state) {
    var claimed = m.getIn(state, ['players', player, 'claimed']);
    return m.count(claimed) === 3;
}

exports.playerHasSet = function(player, state) {
    var claimed = m.getIn(state, ['players', player, 'claimed']);
    console.log("claimed:", claimed);
    console.log("playerHasSet:", set.isSet(claimed));
    return set.isSet(claimed);
}

//TODO
// exports.processClick = function(click, successCallback, )

function updateScore(player, scoreChange, oldState) {
    return m.updateIn(oldState, ['players', player, 'score'], function(oldScore){
        return oldScore + scoreChange;
    });
}
