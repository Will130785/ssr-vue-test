webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app__);


const { app } = Object(__WEBPACK_IMPORTED_MODULE_0__app__["createApp"])();

app.$mount('#app');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Vue = __webpack_require__(3);

module.exports = context => {
  const app = new Vue({
    data: {
      url: context.url
    },
    template: `
      <div>
        <p>The visited URL is: {{ url }}</p>
        <button @click="sayHello">Hello</button>
      </div>
    `,
    methods: {
      sayHello() {
        window.alert('Hello!');
      }
    }
  });

  return app;
};

/***/ })
],[1]);
//# sourceMappingURL=app.966d003a644740942480.js.map