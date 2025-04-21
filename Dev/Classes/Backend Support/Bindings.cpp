#include <emscripten/bind.h>
#include "RandomAccessSet/RandomAccessSet.hpp"
#include "AnnotatedWrapper/AnnotatedWrapper.hpp"
#include "../Backend Main/Card.hpp"

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

EMSCRIPTEN_BINDINGS(annotated_wrapper_bindings) {
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

