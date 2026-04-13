import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { guidesData2 } from "../assets/assets.js";
const CityDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();

  const cityGuides = guidesData2.filter(
    (guide) => guide.city.toLowerCase() === cityName.toLowerCase()
  );

  if (cityGuides.length === 0) {
    return <div className="p-20 text-center">No guides found</div>;
  }

  const allImages = cityGuides.flatMap((guide) => guide.famousPlaceImages);
  const cityDescription = cityGuides[0].placeDescription;

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <h1 className="text-4xl font-semibold text-slate-800">
        Explore {cityName}
      </h1>

      <p className="text-gray-500 mt-4 max-w-4xl leading-7">
        {cityDescription}
      </p>

      {/* Gallery */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">Gallery</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {allImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={cityName}
              className="h-64 w-full object-cover rounded-2xl"
            />
          ))}
        </div>
      </div>

      {/* Guides */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">
          Available Guides
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {cityGuides.map((guide) => (
            <div
            onClick={() => navigate(`/Explore/${cityName}/guide/${guide.id}`)}
              key={guide.id}
              className="border rounded-2xl shadow-lg p-5 hover:bg-blue-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{guide.name}</h3>
                  <p className="text-sm text-gray-500">
                    ⭐ {guide.rating}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-600">
                <strong>Languages:</strong> {guide.languages}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Speciality:</strong> {guide.speciality}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Price:</strong> {guide.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;