#ifndef CSE_CARD_H
#define CSE_CARD_H

#include "../Backend Support/RandomAccessSet/RandomAccessSet.hpp"
#include "../Backend Support/AnnotatedWrapper/AnnotatedWrapper.hpp"
// #include "DynamicString.hpp"
// #include "TagManager.hpp"
// #include "AuditedPointer.hpp"

// namespace cse {

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

#endif