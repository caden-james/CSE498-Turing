#ifndef CSE_BOARD_H
#define CSE_BOARD_H

// #include "DynamicString.hpp"
// #include "TaskColumn.hpp"
#include "RandomAccessSet.hpp"
#include "Card.hpp"

namespace cse {

class Board {
    private:
        cse::RandomAccessSet<Card> cards;
    
    public:
        Board() = default;
    
        bool addCard(const Card& card) {
            return cards.add(card);
        }
    
        bool removeCard(const Card& card) {
            return cards.remove(card);
        }
    
        Card getCard(size_t index) const {
            return cards.get(index);
        }
    
        size_t size() const {
            return cards.size();
        }
};
}
    
#endif
