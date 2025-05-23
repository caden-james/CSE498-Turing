#ifndef CSE_BOARD_H
#define CSE_BOARD_H

// #include "DynamicString.hpp"
// #include "TaskColumn.hpp"
#include "../Backend Support/RandomAccessSet/RandomAccessSet.hpp"
#include "Card.hpp"
#include "CardHash.hpp"

namespace cse {

class Board {
    private:
        cse::RandomAccessSet<Card> cards;
    
    public:
        Board() = default;
    
        // When we click +
        bool addCard(const Card& card) {
            return cards.add(card);
        }
    
        // When we click -
        bool removeCard(const Card& card) {
            return cards.remove(card);
        }
    
        // Grab a card based off index, index is attached to each card when created
        Card getCard(size_t index) const {
            return cards.get(index);
        }
        
        // Debugging purposes
        size_t size() const {
            return cards.size();
        }
};
}
    
#endif
