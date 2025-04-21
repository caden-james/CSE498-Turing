#include <emscripten/bind.h>
#include "RandomAccessSet/RandomAccessSet.hpp"

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

