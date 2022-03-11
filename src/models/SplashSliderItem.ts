export type SplashSliderItem = {
  title: string;
  subtitle: string;
  imagePath: any;
};

const getSliderData = (reload: string) => {
  const splashSliderData: SplashSliderItem[] = [
    {
      title: "Discover",
      subtitle: "Find awesome places to eat and drink near you.",
      imagePath: require("assets/images/splash_explore.png")
    },
    {
      title: "Order & Pay",
      subtitle: "For delivery, dine in and takeaway",
      imagePath: require("assets/images/splash_menu.png")
    },
    {
      title: "Guaranteed Discounts",
      subtitle: `Reload all redeemed offers each week for ${reload}`,
      imagePath: require("assets/images/splash_discount.png")
    },
    {
      title: "What’s On",
      subtitle: "Find out about events and offers in real time",
      imagePath: require("assets/images/splash_whats'on.png")
    },
    {
      title: "Credits & Rewards",
      subtitle: "Earn credits by inviting friends and sharing offers",
      imagePath: require("assets/images/splash_reload.png")
    }
  ];
  return splashSliderData;
};

export default getSliderData;
