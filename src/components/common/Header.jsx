// // 📁 src/components/common/Header.jsx

// import React, { useState, useEffect } from "react";
// import { Bell, User, Settings, LogOut } from "lucide-react";
// import navigationConfig from "../../constants/navigationConfig";
// import { Link, useNavigate } from "react-router-dom";
// import { clearAuthToken } from "../../services/config";
// import { clearUserData } from "../../services/auth";

// // Header Component with Profile Dropdown
// const Header = ({ currentRole }) => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const navigate = useNavigate();
//   const config = navigationConfig[currentRole];

//   // Get user info from localStorage
//   const userName = localStorage.getItem("userName") || "User";
//   const userEmail = localStorage.getItem("userEmail") || "";

//   // Load profile picture on component mount
//   useEffect(() => {
//     const loadProfilePicture = () => {
//       // Try to get profile picture from localStorage first
//       const storedProfilePic = localStorage.getItem("userProfilePicture");
//       if (storedProfilePic) {
//         setProfilePicture(storedProfilePic);
//       } else {
//         // If no stored profile picture, try to get from API or other source
//         const profilePicUrl = localStorage.getItem("userProfilePicUrl");
//         if (profilePicUrl) {
//           setProfilePicture(profilePicUrl);
//         }
//       }
//     };

//     loadProfilePicture();
//   }, []);

//   // Get first name from full name
//   const getFirstName = (fullName) => {
//     if (!fullName) return "User";
//     return fullName.split(" ")[0];
//   };

//   // Get first letter for avatar
//   const getInitial = (fullName) => {
//     if (!fullName) return "U";
//     const firstName = fullName.split(" ")[0];
//     return firstName.charAt(0).toUpperCase();
//   };

//   const handleLogout = () => {
//     // Clear all auth data using the centralized function
//     clearAuthToken();
//     clearUserData();

//     // Redirect to login
//     navigate("/login", { replace: true });
//   };

//   // Profile Avatar Component
//   const ProfileAvatar = () => {
//     if (profilePicture) {
//       return (
//         <img
//           src={profilePicture}
//           alt="Profile"
//           className="w-8 h-8 rounded-full object-cover"
//           onError={() => {
//             // If image fails to load, remove it from state and localStorage
//             setProfilePicture(null);
//             localStorage.removeItem("userProfilePicture");
//             localStorage.removeItem("userProfilePicUrl");
//           }}
//         />
//       );
//     }

//     // Fallback to initial
//     return (
//       <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
//         {getInitial(userName)}
//       </div>
//     );
//   };

//   return (
//     <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center relative">
//       <div className="flex items-center space-x-2">
//         <span>{config.avatar}</span>
//         <Link to="/">
//           <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text font-semibold text-xl text-transparent">
//             Potluck
//           </span>
//         </Link>
//       </div>

//       <div className="flex space-x-4 items-center">
//         <Bell className="w-5 h-5 text-gray-500" />
//         <button
//           onClick={() => setIsProfileOpen(!isProfileOpen)}
//           className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
//         >
//           <ProfileAvatar />
//           <span className="text-sm font-medium text-gray-700">
//             {getFirstName(userName)}
//           </span>
//         </button>

//         {/* Profile Dropdown */}
//         {isProfileOpen && (
//           <>
//             <div
//               className="fixed inset-0 z-10"
//               onClick={() => setIsProfileOpen(false)}
//             />
//             <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-20">
//               <div className="p-4 border-b">
//                 <div className="flex items-center space-x-3 mb-2">
//                   {/* Larger profile picture in dropdown */}
//                   {profilePicture ? (
//                     <img
//                       src={profilePicture}
//                       alt="Profile"
//                       className="w-12 h-12 rounded-full object-cover"
//                       onError={() => {
//                         setProfilePicture(null);
//                         localStorage.removeItem("userProfilePicture");
//                         localStorage.removeItem("userProfilePicUrl");
//                       }}
//                     />
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-lg">
//                       {getInitial(userName)}
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold truncate">{userName}</p>
//                     <p className="text-sm text-gray-600 truncate">
//                       {userEmail}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500 capitalize">
//                   {currentRole}
//                 </p>
//               </div>
//               <div className="py-2">
//                 <button
//                   onClick={() => {
//                     setIsProfileOpen(false);
//                     navigate(`/dashboard/${currentRole}/profile`);
//                   }}
//                   className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
//                 >
//                   <User className="w-4 h-4 mr-3" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsProfileOpen(false);
//                     navigate(`/dashboard/${currentRole}/settings`);
//                   }}
//                   className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
//                 >
//                   <Settings className="w-4 h-4 mr-3" />
//                   Settings
//                 </button>
//                 <div className="border-t my-2"></div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 text-red-600"
//                 >
//                   <LogOut className="w-4 h-4 mr-3" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


// 📁 src/components/common/Header.jsx - Enhanced with beautiful profile dropdown

import React, { useState, useEffect } from "react";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import navigationConfig from "../../constants/navigationConfig";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../services/config";
import { clearUserData } from "../../services/auth";

// Header Component with Enhanced Profile Dropdown
const Header = ({ currentRole }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const config = navigationConfig[currentRole];

  // Get user info from localStorage
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";

  // Load profile picture on component mount
  useEffect(() => {
    const loadProfilePicture = () => {
      // Try to get profile picture from localStorage first
      const storedProfilePic = localStorage.getItem("userProfilePicture");
      if (storedProfilePic) {
        setProfilePicture(storedProfilePic);
      } else {
        // If no stored profile picture, try to get from API or other source
        const profilePicUrl = localStorage.getItem("userProfilePicUrl");
        if (profilePicUrl) {
          setProfilePicture(profilePicUrl);
        }
      }
    };

    loadProfilePicture();
  }, []);

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.split(" ")[0];
  };

  // Get first letter for avatar
  const getInitial = (fullName) => {
    if (!fullName) return "U";
    const firstName = fullName.split(" ")[0];
    return firstName.charAt(0).toUpperCase();
  };

  // Get role display name with emoji
  const getRoleDisplayInfo = (role) => {
    const roleInfo = {
      potchef: { name: 'Chef', emoji: '👨‍🍳', color: 'bg-blue-100 text-blue-800' },
      potlucky: { name: 'Food Lover', emoji: '🍽️', color: 'bg-green-100 text-green-800' },
      franchisee: { name: 'Franchisee', emoji: '🏢', color: 'bg-purple-100 text-purple-800' },
      admin: { name: 'Administrator', emoji: '⚙️', color: 'bg-red-100 text-red-800' }
    };
    return roleInfo[role] || { name: role, emoji: '👤', color: 'bg-gray-100 text-gray-800' };
  };

  const handleLogout = () => {
    // Clear all auth data using the centralized function
    clearAuthToken();
    clearUserData();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ size = "small" }) => {
    const sizeClasses = {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-16 h-16"
    };

    const textSizeClasses = {
      small: "text-sm",
      medium: "text-base",
      large: "text-xl"
    };

    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt="Profile"
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white shadow-sm`}
          onError={() => {
            // If image fails to load, remove it from state and localStorage
            setProfilePicture(null);
            localStorage.removeItem("userProfilePicture");
            localStorage.removeItem("userProfilePicUrl");
          }}
        />
      );
    }

    // Fallback to initial
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold ${textSizeClasses[size]} ring-2 ring-white shadow-sm`}>
        {getInitial(userName)}
      </div>
    );
  };

  const roleInfo = getRoleDisplayInfo(currentRole);

  return (
    <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{config.avatar}</span>
        <Link to="/">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text font-semibold text-xl text-transparent">
            Potluck
          </span>
        </Link>
      </div>

      <div className="flex space-x-4 items-center">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
          {/* Notification badge - you can make this dynamic */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </div>

        {/* Enhanced Profile Button */}
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200 hover:shadow-sm"
        >
          <ProfileAvatar size="medium" />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {getFirstName(userName)}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {roleInfo.name}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isProfileOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Enhanced Profile Dropdown */}
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-16 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 border-b border-orange-200">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 rounded-full transform translate-x-6 -translate-y-6"></div>
                </div>
                
                <div className="relative flex items-start space-x-4">
                  <ProfileAvatar size="large" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {userName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {userEmail}
                    </p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      <span>{roleInfo.emoji}</span>
                      <span>{roleInfo.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(`/dashboard/${currentRole}/profile`);
                  }}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 mr-3 group-hover:bg-blue-200 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profile</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(`/dashboard/${currentRole}/settings`);
                  }}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 mr-3 group-hover:bg-purple-200 transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-xs text-gray-500">Preferences & privacy</p>
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 mr-3 group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Sign out</p>
                    <p className="text-xs text-red-400">Come back soon!</p>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Potluck v2.0 • Made with ❤️
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;