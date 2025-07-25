const adminRouter = require("./adminRoutes");
const bannerRouter = require("./bannerRoutes");
const brandRouter = require("./brandRoutes");
const categoryRouter = require("./categoryRoutes");
const labelRouter = require("./labelRoutes");
const orderRouter = require("./orderRoutes");
const productRouter = require("./productRoutes");
const userRouter = require("./userRoutes");
const v1Router = require("express").Router();
const offerBannerRouter = require("./offerBannerRoute");
const storeRouter = require("./storeRoutes");
const offerRouter = require("./offerRoutes");
const salesRouter = require("./salesRoutes");
const inventoryRouter = require("./inventoryRoutes");
const subCategoryRouter = require("./subcategoryRoutes");
const feedbackRouter = require("./feedbackRoute");
const cartRouter = require("./cartRoutes");
const couponRouter = require("./couponRoute");
const reviewRouter = require("./reviewRoutes");

v1Router.use("/user", userRouter);
v1Router.use("/product", productRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/category", categoryRouter);
v1Router.use("/label", labelRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/brand", brandRouter);
v1Router.use("/banner", bannerRouter);
v1Router.use("/offerBanner", offerBannerRouter);
v1Router.use("/store", storeRouter);
v1Router.use("/offer", offerRouter);
v1Router.use("/sales", salesRouter);
v1Router.use("/inventory", inventoryRouter);
v1Router.use("/subcategory", subCategoryRouter);
v1Router.use("/feedback", feedbackRouter);
v1Router.use("/cart", cartRouter)
v1Router.use("/coupon", couponRouter)
v1Router.use("/review", reviewRouter)



module.exports = v1Router;
