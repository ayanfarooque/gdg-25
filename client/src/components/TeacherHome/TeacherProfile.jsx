function ProfileCard() {
    return (
      <div className="w-80">
        <div className="bg-[#E195AB] text-white rounded-xl p-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-white overflow-hidden mb-4">
              <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="text-sm bg-red-500 rounded-full px-3 py-1 mb-4">ramd@gmail.com</div>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Name: </span>Tukaram Krishnaji Korade
            </div>
            <div>
              <span className="font-semibold">Teacher ID: </span>50
            </div>
            <div>
              <span className="font-semibold">Address: </span>402, Sprayday Canga, Bhanunogor
            </div>
            <div>
              <span className="font-semibold">DOB: </span>02-05-1973
            </div>
            <div>
              <span className="font-semibold">Subject: </span>Maths
            </div>
            <div>
              <span className="font-semibold">Class: </span>9th
            </div>
          </div>
          
        </div>
      </div>
    )
  }
  
  export default ProfileCard
  

