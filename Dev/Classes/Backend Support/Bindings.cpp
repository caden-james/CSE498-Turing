#include <emscripten/bind.h>
#include "RandomAccessSet/RandomAccessSet.hpp"
#include "AuditedPointer/AuditedPointer.hpp"

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

    function("makeAuditedPointerInt", &cse::MakeAudited<int>); // factory for the make_audioed function
}

