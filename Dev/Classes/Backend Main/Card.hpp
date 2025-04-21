#ifndef CSE_CARD_H
#define CSE_CARD_H

#include "../Backend Support/RandomAccessSet/RandomAccessSet.hpp"
#include "../Backend Support/AnnotatedWrapper/AnnotatedWrapper.hpp"
#include "../Backend Support/AuditedPointer/AuditedPointer.hpp"

// #include "DynamicString.hpp"
// #include "TagManager.hpp"

// Test class currently without DynamicString or TagManager
namespace cse {

    class Card : public AnnotatedWrapper<std::string> {
    private:
        int mId;
        // Need to swap in DynamicString when available
        Aptr<std::string> mContent;
    
    public:
        Card() : mId(0), mContent(new std::string("")) {}
        Card(int id, const std::string& content)
            : mId(id), mContent(new std::string(content)) {}
    
        int getId() const { return mId; }
    
        std::string getContent() const {
            return *mContent;
        }
    
        void setContent(const std::string& newContent) {
            *mContent = newContent;
        }
    
        void clearContent() {
            *mContent = "";
        }
    };
    
    }
    
#endif

// class Card : public AnnotatedWrapper {
//     private:
//     int mId;
//     // Dynamic string holds the card's content
//     AuditedPointer<DynamicString> mContent;
//      // Tag manager to manage card tags
//     TagManager mTags;
    
//     public:
//     Card() = default;
//     Card(int id, const std::string& content)
//         : mId(id), mContent(new DynamicString()) {
//         mContent->addSegment(content); // Initial content added to dynamic string
//     }

//     int getId() const { return mId; }

//     std::string getContent() const {
//         return mContent->toString();
//     }

//     void setContent(const std::string& newContent) {
//         mContent->clear();
//         mContent->addSegment(newContent);
//     }

//     void addTag(const std::string& tag) {
//         mTags.addTag(tag, mId);
//     }

//     void removeTag(const std::string& tag) {
//         mTags.removeTag(tag, mId);
//     }

//     bool hasTag(const std::string& tag) const {
//         return mTags.hasTag(tag, mId);
//     }

//     std::vector<std::string> getTags() const {
//         return mTags.getTagsForEntry(mId);
//     }
// };
// }