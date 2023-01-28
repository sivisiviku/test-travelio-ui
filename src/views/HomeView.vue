<template>
  <div class="relative">
    <NavComponent
      class="fixed top-0 left-0 right-0 z-10"
      @emitSearch="search"
      @emitFavoriteBooks="favoriteBooks"
      @emitAllBooks="allBooks"
    />
  </div>
  <div
    class="fixed top-14 left-0 right-[80%] bottom-0 overflow-auto px-8 pt-6 bg-sky-100"
  >
    <div v-for="(book, index) in books" :key="index">
      <div
        class="mb-3 text-slate-600 hover:text-sky-600 cursor-pointer"
        @click="detail(book, index)"
      >
        <font-awesome-icon
          v-if="book.isFavorite"
          icon="fa-solid fa-bookmark"
          class="mr-1"
        />
        {{ book.title }}
      </div>
    </div>
  </div>
  <div ref="about" class="h-14"></div>
  <div v-if="bookDetail.title !== ''" class="ml-[20%] text-center p-8">
    <div class="text-xl text-sky-600 font-semibold">
      {{ bookDetail.title }}
    </div>
    <div class="flex justify-center items-center mt-6">
      <img :src="bookDetail.thumbnail" alt="" />
    </div>
    <div class="font-semibold mt-4">Authors: {{ bookDetail.authors }}</div>
    <div class="flex justify-center items-center mt-2">
      <span class="font-semibold mr-1">Rating:</span>
      <img
        v-for="(starImage, index) in bookDetail.averageRating"
        :key="index"
        :src="starImage"
        alt=""
        class="w-5"
      />
    </div>
    <div class="flex justify-center items-center mt-4">
      <div
        v-if="bookDetail.isFavorite === false"
        class="bg-sky-600 py-2 px-8 text-white w-max rounded-md cursor-pointer"
        @click="addFavorite(bookDetail.index)"
      >
        Add to favorite
      </div>
      <div
        v-if="bookDetail.isFavorite === true"
        class="bg-red-600 py-2 px-8 text-white w-max rounded-md cursor-pointer"
        @click="removeFavorite(bookDetail.index)"
      >
        Remove from favorite
      </div>
    </div>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent.vue";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      books: [],
      inFavoritePage: false,
      bookDetail: {
        id: 0,
        title: "",
        thumbnail: "",
        authors: "",
        averageRating: "",
        isFavorite: false,
      },
    };
  },
  components: {
    NavComponent,
  },
  computed: mapGetters(["getData"]),
  methods: {
    ...mapActions(["storeData", "modifyIsFavorite"]),
    async search(keyword) {
      const response = await axios.post(
        "https://test-travelio.herokuapp.com/read",
        {
          keyword: keyword,
        }
      );
      this.books = response.data.data;
      this.storeData(this.books);
      this.inFavoritePage = false;
      this.bookDetail = {
        id: 0,
        title: "",
        thumbnail: "",
        authors: "",
        averageRating: "",
        isFavorite: false,
      };
    },
    async favoriteBooks() {
      const response = await axios.post(
        "https://test-travelio.herokuapp.com/read-favorite",
        {
          page: 1,
          limit: 100,
        }
      );
      this.books = response.data.data;
      this.inFavoritePage = true;
      this.bookDetail = {
        id: 0,
        title: "",
        thumbnail: "",
        authors: "",
        averageRating: "",
        isFavorite: false,
      };
    },
    allBooks() {
      this.books = this.getData;
      this.inFavoritePage = false;
      this.bookDetail = {
        id: 0,
        title: "",
        thumbnail: "",
        authors: "",
        averageRating: "",
        isFavorite: false,
      };
    },
    detail(book, index) {
      let authors = "";
      if (book.authors !== undefined) {
        if (Array.isArray(book.authors)) {
          authors = book.authors.join(", ");
        } else {
          authors = book.authors;
        }
      }
      let rating =
        book.averageRating !== undefined
          ? book.averageRating
          : book.average_rating;
      this.bookDetail = {
        index: index,
        id: book.id,
        title: book.title,
        thumbnail: book.thumbnail,
        authors: authors,
        averageRating: this.star(rating),
        isFavorite: book.isFavorite,
      };
    },
    star(rating) {
      const limit = Math.ceil(rating);
      const starSplit = String(rating).split(".");
      const starImages = [];
      for (let i = 0; i < limit; i++) {
        if (i != limit - 1) {
          starImages.push(require("../assets/images/full.png"));
        } else {
          if (starSplit.length > 1) {
            starImages.push(require("../assets/images/half.png"));
          } else {
            starImages.push(require("../assets/images/full.png"));
          }
        }
      }
      return starImages;
    },
    addFavorite(index) {
      axios.post(
        "https://test-travelio.herokuapp.com/create",
        this.books[index]
      );
      this.books[index].isFavorite = true;
      this.bookDetail.isFavorite = true;
      this.storeData(this.books);
    },
    removeFavorite(index) {
      axios.post("https://test-travelio.herokuapp.com/delete", {
        id: this.books[index].id,
      });
      if (this.inFavoritePage) {
        let tempBooks = this.getData.map((data) => {
          if (data.id === this.books[index].id) {
            data.isFavorite = false;
          }
          return data;
        });
        this.storeData(tempBooks);
        this.books.splice(index, 1);
        this.bookDetail = {
          id: 0,
          title: "",
          thumbnail: "",
          authors: "",
          averageRating: "",
          isFavorite: false,
        };
      } else {
        this.books[index].isFavorite = false;
        this.bookDetail.isFavorite = false;
        this.storeData(this.books);
      }
    },
  },
};
</script>

<style scoped></style>
