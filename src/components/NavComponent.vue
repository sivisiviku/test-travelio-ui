<template>
  <div
    class="flex justify-between items-center xssm:px-20 xssm:py-4 px-10 py-2 shadow-md bg-white"
  >
    <div>
      <button
        class="font-semibold text-slate-500 hover:text-sky-600 cursor-pointer"
        @click="emitAllBooks"
      >
        All Books
      </button>
      <button
        class="font-semibold text-slate-500 hover:text-sky-600 cursor-pointer ml-8"
        @click="emitFavoriteBooks"
      >
        Favorite Books
      </button>
    </div>
    <div>
      <input
        type="text"
        placeholder="title, author"
        class="w-ful p-2 rounded-md focus:outline-none bg-slate-300"
        v-model="keyword"
      />
      <button
        type="submit"
        class="bg-sky-600 text-white px-6 py-2 rounded-md cursor-pointer ml-2"
        @click="emitSearch"
      >
        Search
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    emitSearch() {
      this.$emit("emitSearch", this.keyword);
    },
    emitFavoriteBooks() {
      this.$emit("emitFavoriteBooks");
    },
    emitAllBooks() {
      this.$emit("emitAllBooks");
    },
  },
};
</script>

<style scoped></style>
