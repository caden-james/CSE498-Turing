#include <emscripten/bind.h>
#include "RandomAccessSet/RandomAccessSet.hpp"
#include "AnnotatedWrapper/AnnotatedWrapper.hpp"
#include "../Backend Main/Card.hpp"
#include "AuditedPointer/AuditedPointer.hpp"
#include "TagManager/TagManager.hpp"
#include "DynamicString/DynamicString.hpp"

using namespace emscripten;

/**
 * @details Holds all the Emscripten Bindings
 * @brief To ensure all items are found in one place, all bindings will be placed here
 */

// This will stay as an error b/c c++ cannot compile it BUT emscripten can so it works regardless
EMSCRIPTEN_BINDINGS(RandomAccessSet_int) {
    class_<cse::RandomAccessSet<int>>("RandomAccessSetInt")
        .constructor<>()
        .function("add", &cse::RandomAccessSet<int>::add)
        .function("contains", &cse::RandomAccessSet<int>::contains)
        .function("get", &cse::RandomAccessSet<int>::get)
        .function("remove", &cse::RandomAccessSet<int>::remove)
        .function("size", &cse::RandomAccessSet<int>::size)
        .function("getIndexOf", &cse::RandomAccessSet<int>::getIndexOf);
}

EMSCRIPTEN_BINDINGS(AnnotatedWrapper) {
    class_<cse::AnnotatedWrapper<std::string>>("AnnotatedWrapperString")
        .constructor<>()
        .function("addAnnotation", &cse::AnnotatedWrapper<std::string>::addAnnotation)
        .function("getAnnotation", &cse::AnnotatedWrapper<std::string>::getAnnotation)
        .function("removeAnnotation", &cse::AnnotatedWrapper<std::string>::removeAnnotation)
        .function("clearAnnotations", &cse::AnnotatedWrapper<std::string>::clearAnnotations)
        .function("listAnnotations", optional_override([](cse::AnnotatedWrapper<std::string>& self) {
            self.listAnnotations([](const std::string& key, const std::string& value) {
                std::cout << key << ": " << value << std::endl;
            });
        }))
        .function("setFontSize", &cse::AnnotatedWrapper<std::string>::setFontSize)
        .function("getFontSize", &cse::AnnotatedWrapper<std::string>::getFontSize);
}

// EMSCRIPTEN_BINDINGS(CardBindings) {
//     class_<cse::Card>("Card")
//         .constructor<int, std::string>()
//         .function("getId", &cse::Card::getId)
//         .function("getContent", &cse::Card::getContent)
//         .function("setContent", &cse::Card::setContent)
//         .function("addTag", &cse::Card::addTag)
//         .function("removeTag", &cse::Card::removeTag)
//         .function("hasTag", &cse::Card::hasTag)
//         .function("getTags", &cse::Card::getTags);
// }

// UNFINISHED ------
EMSCRIPTEN_BINDINGS(Card_Module) {
    class_<cse::Card>("Card")
        .constructor<>()
        .constructor<int, std::string>()
        .function("getId", &cse::Card::getId)
        .function("getContent", &cse::Card::getContent)
        .function("setContent", &cse::Card::setContent)
        .function("clearContent", &cse::Card::clearContent);
}

EMSCRIPTEN_BINDINGS(AuditedPointer_int) {
    class_<cse::Aptr<int>>("AuditedPointerInt")
        .constructor<>()
        .constructor<int*>()
        .function("delete", &cse::Aptr<int>::Delete)
        .function("getID", &cse::Aptr<int>::GetID)
        .function("deref", &cse::Aptr<int>::operator*, allow_raw_pointers())
        .function("get", &cse::Aptr<int>::operator->, allow_raw_pointers())
        .class_function("getActiveAptrs", &cse::Aptr<int>::GetActiveAptrs)
        .class_function("find", &cse::Aptr<int>::Find)
        .class_function("reset", &cse::Aptr<int>::Reset);

    function("makeAuditedPointerInt", &cse::MakeAudited<int>); // factory for the make_audited function
}

// EMSCRIPTEN_BINDINGS(DynamicString) {
//     class_<DynamicString>("DynamicString")
//         .constructor<>()
//         .constructor<const std::string&>()
//         .constructor<DynamicString::str_fun_t>()
//         .function("toString", &DynamicString::ToString)
//         .function("appendString", static_cast<void (DynamicString::*)(const std::string&)>(&DynamicString::Append))
//         .function("appendFunction", static_cast<void (DynamicString::*)(DynamicString::str_fun_t)>(&DynamicString::Append))

        
//     function("createDynamicStringFunction", optional_override([](val jsFunc) {
//         return DynamicString::str_fun_t([jsFunc]() {
//             return jsFunc().as<std::string>();
//         });
//     }));
// }

EMSCRIPTEN_BINDINGS(TagManager) {
    class_<cse::TagManager>("TagManager")
        .constructor<>()
        .function("addTag", &cse::TagManager::addTag)
        .function("removeTag", &cse::TagManager::removeTag)
        .function("getTags", &cse::TagManager::getTags)
        .function("getTaskTags", &cse::TagManager::getTaskTags)
        .function("clearTagsForTask", &cse::TagManager::clearTagsForTask)
        .function("clearTags", &cse::TagManager::clearTags)
        .function("hasTag", &cse::TagManager::hasTag);
    
    register_vector<std::string>("VectorString");
}
