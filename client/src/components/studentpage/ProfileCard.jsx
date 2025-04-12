function ProfileCard() {
  return (
    <div className="w-80 h-96 mx-auto">
      <div className="bg-gray-700 text-gray-100 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden mb-4 shadow-md">
            <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>

          {/* Email Tag */}
          <div className="text-xs bg-red-600 text-white rounded-full px-3 py-1 mb-4 shadow-sm">
            myfriend@gmail.com
          </div>
        </div>

        {/* Student Info */}
        <div className="space-y-3 text-sm text-gray-300">
          <div><span className="font-semibold text-gray-200">Name: </span>Ali</div>
          <div><span className="font-semibold text-gray-200">Student ID: </span>50</div>
          <div><span className="font-semibold text-gray-200">Address: </span>402, Sprayday Canga, Bhanunogor</div>
          <div><span className="font-semibold text-gray-200">DOB: </span>02-05-2005</div>
          <div><span className="font-semibold text-gray-200">Guardian: </span>Usman Suleman</div>
          <div><span className="font-semibold text-gray-200">Class: </span>9th</div>
        </div>

        {/* Badges Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-lg text-gray-100">Your Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-500 text-gray-100 rounded-full text-sm shadow-sm">🎯 15</span>
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-semibold rounded-full text-sm shadow-sm">🏆 Gold</span>
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm shadow-sm">⭐ 10</span>
          </div>
        </div>

        {/* Download Result Button */}
        <button className="bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-2 px-4 rounded-lg mt-6 w-full shadow-lg">
          Download Result
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
