/* Shared activity data (used by home.jsx and Activity.jsx).
   `checks` drive the "Nice work!" / "Almost there" result dialog. */
export const ACTIVITIES = [
  {
    id: "login-form", title: "Login Form", status: "Completed", steps: [4, 4],
    desc: "Create a form for users to enter their email and password.",
    checks: [
      { label: "Includes an email input field", file: "html", re: "type=[\"']email[\"']" },
      { label: "Includes a password input field", file: "html", re: "type=[\"']password[\"']" },
      { label: "Has a submit button", file: "html", re: "<button|type=[\"']submit[\"']" },
      { label: "Form has custom styling in style.css", file: "css", re: "\\{[^}]*:[^}]+\\}" },
    ],
  },
  {
    id: "registration-form", title: "Registration Form", status: "Not started", steps: [0, 4],
    desc: "Design a signup form with name, email and password fields.",
    checks: [
      { label: "Includes a name input", file: "html", re: "name|fullname" },
      { label: "Includes an email input", file: "html", re: "type=[\"']email[\"']" },
      { label: "Includes a password input", file: "html", re: "type=[\"']password[\"']" },
      { label: "Has custom styling", file: "css", re: "\\{[^}]*:[^}]+\\}" },
    ],
  },
  {
    id: "add-to-cart-card", title: "Add to Cart Card", status: "Not started", steps: [0, 4],
    desc: "Create a product card with an Add to Cart button.",
    checks: [
      { label: "Has a product title", file: "html", re: "<h[1-6]" },
      { label: "Has an image", file: "html", re: "<img" },
      { label: "Has an Add to Cart button", file: "html", re: "<button" },
      { label: "Card is styled in style.css", file: "css", re: "\\{[^}]*:[^}]+\\}" },
    ],
  },
  {
    id: "responsive-navbar", title: "Responsive Navbar", status: "In progress", steps: [2, 4],
    desc: "Create a navigation bar that adapts to different screen sizes.",
    checks: [
      { label: "Has a logo or brand name", file: "html", re: "class=[\"'][^\"']*logo" },
      { label: "Contains Home, About, and Contact links", file: "html", re: "Home[\\s\\S]*About[\\s\\S]*Contact" },
      { label: "Uses a navigation container", file: "html", re: "<nav" },
      { label: "Uses custom CSS styling", file: "css", re: "display\\s*:\\s*flex" },
    ],
  },
  {
    id: "pricing-tier-card", title: "Pricing Tier Card", status: "Not started", steps: [0, 4],
    desc: "Build a card that compares plan features and price.",
    checks: [
      { label: "Shows a price", file: "html", re: "\\$|price" },
      { label: "Lists features", file: "html", re: "<li" },
      { label: "Has a call-to-action button", file: "html", re: "<button|<a " },
      { label: "Has custom styling", file: "css", re: "\\{[^}]*:[^}]+\\}" },
    ],
  },
  {
    id: "profile-card", title: "Profile Card Component", status: "Not started", steps: [0, 4],
    desc: "Design a profile card with avatar, name and short bio.",
    checks: [
      { label: "Has an avatar image", file: "html", re: "<img" },
      { label: "Has a name heading", file: "html", re: "<h[1-6]" },
      { label: "Has a bio paragraph", file: "html", re: "<p" },
      { label: "Has custom styling", file: "css", re: "\\{[^}]*:[^}]+\\}" },
    ],
  },
];

export const BADGES = ["First Step", "Quick Starter", "Problem Solver", "On a Roll"];
