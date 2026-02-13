const SCHEMAS = {
  SIGN_UP: {
    fields: [
      { name: "firstName", label: "First Name ", type: "text", required: true },
      { name: "lastName", label: "Last Name ", type: "text" },
      {
        name: "phoneNumber",
        label: "Phone Number ",
        type: "number",
        required: true,
      },
      { name: "email", label: "Email ", type: "email", required: true },
      {
        name: "password",
        label: "Password ",
        type: "password",
        required: true,
      },
      {
        name: "confirmPassword",
        label: "Confirm Password ",
        type: "password",
        required: true,
        uiOnly: true,
      },
      {
        name: "batch",
        label: "Batch ",
        type: "select",
        options: ["OBH_1", "OBH_2", "OBH_3"],
        required: true,
      },
      {
        name: "centerLocation",
        label: "Center Location ",
        type: "select",
        options: ["hyderabad", "pune", "chennai", "bengaluru", "noida"],
        required: true,
      },
      {
        name: "courseType",
        label: "Course Type ",
        type: "select",
        options: ["mern", "java", "da"],
        required: true,
      },
      {
        name: "isInstructor",
        label: "User Type ",
        type: "select",
        options: ["Student", "Instructor"],
        required: true,
      },
      {
        name: "isPlaced",
        label: "Placed",
        type: "checkbox", // boolean
      },
      {
        name: "organizationName",
        label: "Organization Name",
        type: "text",
        required: false,
        showWhen: {
          field: "isPlaced",
          value: true,
        },
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        required: false,
        showWhen: {
          field: "isPlaced",
          value: true,
        },
      },

      {
        name: "profilePicture",
        label: "Profile Picture ",
        type: "file",
         uiOnly: false
      },
    ],
    toggleText: "Already have an account?",
    toggleLinkText: "Sign In",
    toggleRoute: "/signIn",
  },
};

// Initialize state properly - BEFORE useState
const getInitialState = (schema) => {
  const state = {};

  schema.fields.forEach((field) => {
    if (field.type === "file") state[field.name] = null;
    else if (field.type === "checkbox") state[field.name] = false;
    else state[field.name] = "";
  });

  return state;
};

const handleFeildChange = (e, field, formData, setFormData, setFileName) => {
  if (field.type === 'file') {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      setFormData({ ...formData, [field.name]: file });
      setFileName(file.name);
    }
  } else if (field.type === 'checkbox') {
    setFormData({ ...formData, [field.name]: e.target.checked });
  } else {
    setFormData({ ...formData, [field.name]: e.target.value });
  }
};

// Function to show time like "5m", "1h", "2d" - Post Uploaded Date and Time
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "y", value: 31536000 },
    { label: "mo", value: 2592000 },
    { label: "d", value: 86400 },
    { label: "h", value: 3600 },
    { label: "m", value: 60 },
  ];
  for (let i of intervals) {
    const count = Math.floor(seconds / i.value);
    if (count >= 1) return count + i.label;
  }
  return "Just now";
};

// Light & Dark Images
const IMAGES = {
  signup: {
    light:
      "https://image2url.com/r2/bucket2/images/1767958756825-00cd0488-67f7-421b-bc54-abf147e0f9fc.png",
    dark: "https://image2url.com/r2/bucket2/images/1767958374676-20a5f525-3e7d-492e-89ac-d39c01d1682c.png",
  },
  signin: {
    light:
      "https://image2url.com/r2/bucket2/images/1767942239259-227cc067-e223-407b-bae2-d1715cc50b0d.png",
    dark: "https://image2url.com/r2/bucket2/images/1767942288651-d168a34e-d4f2-4fe4-aa19-a1b8d26e03d5.png",
  },
  NavBar:{
    dark:"https://image2url.com/r2/bucket1/images/1767894408243-62ba4d6e-32fa-45c1-9729-1ee2069e6eeb.png",
    light:"https://image2url.com/images/1766231228995-009f0af1-1d0d-4fe4-9488-c3d68d8b4bdc.png"
  }
};

const DEFAULT_AVATAR =
  "https://somaaccioconnect.s3.ap-south-2.amazonaws.com/defaults/default.png";

const Colors = {
  HomeBG: "radial-gradient(ellipse at bottom right, #1f293b 0%, #0b0f14 70%)",
  SideBarBaseCSs:
    "flex  items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300",
  SideBarLightMode:
    "hover:ring hover:ring-gray-300 hover:shadow-[0_0_12px_rgba(156,163,175,0.35)]",
  SideBarDarkMode:
    "hover:ring-2 hover:ring-gray-400 hover:shadow-[0_0_50px_rgba(168,85,247,0.3),0_0_80px_rgba(59,130,246,0.2)]",
  RightPannelBG: {
    backgroundColor: "#0a0b0d",
    backgroundImage:
      'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.0" numOctaves="5" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.2"/%3E%3C/svg%3E\')',
    backgroundBlendMode: "screen",
  },
  NavbarBG:{
      backgroundColor: "#0a0a0a",
  backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\" opacity=\"0.3\"/%3E%3C/svg%3E')",
  backgroundBlendMode: "overlay"
  },
};
// Toaster style
const getToastOptions = (isDark) => ({
  style: {
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f3f4f6" : "#111827",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
  },
  success: {
    style: {
      background: isDark ? "#064e3b" : "#d1fae5",
      color: isDark ? "#a7f3d0" : "#065f46",
    },
  },
  error: {
    style: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
    },
  },
});
// Froala Css
  const froalaConfig = {
    placeholderText: 'Write your blog post here...',
    charCounterCount: true,
    heightMin: 150,
    heightMax: 250,
    width: '100%',
    toolbarSticky: false,
    toolbarInline: false,
    toolbarVisibleWithoutSelection: true,
    toolbarButtons: [
      'bold', 'italic', 'underline', 'fontSize', '|',
      'formatOL', 'formatUL', '|',
      'emoticons', 'insertHR', '|',
      'undo', 'redo'
    ],
    pluginsEnabled: ['emoticons', 'charCounter', 'lists', 'fontSize']
  };
  //Modal 
  const ModaldarkStyle = {
  position: "relative",
  padding: "24px",
  borderRadius: "16px",
  color: "#e5e7eb",
  backgroundImage: `
    radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.025),
      transparent 42%
    ),
    linear-gradient(
      180deg,
      #0f1012,
      #08090a
    )`,
  backgroundColor:"#000000",
  boxShadow: "0 25px 50px rgba(0,0,0,0.9)",
  overflow: "hidden",
};

const ModalNoiseStyle = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.2,
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
};

export {
  SCHEMAS,
  timeAgo,
  IMAGES,
  Colors,
  getToastOptions,
  handleFeildChange,
  DEFAULT_AVATAR,
  getInitialState,
  froalaConfig,
  ModaldarkStyle,
  ModalNoiseStyle,
};
