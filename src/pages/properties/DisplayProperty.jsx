// src/pages/properties/DisplayProperty.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import SectionCard from "../../components/form/SectionCard";
import useStaffPropertyDetail from "../../hooks/addproperty/admin/useStaffPropertyDetail";

function money(n, curr = "CAD") {
  try {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: curr, maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `${curr} ${Number(n || 0).toLocaleString()}`;
  }
}

const formatDate = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-CA");
};

const formatFileSize = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  const mb = kb / 1024;
  return mb > 1 ? `${mb.toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
};

const DisplayRow = ({ label, value, multiline = false, className = "" }) => (
  <div className={`grid grid-cols-2 items-start gap-2 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors ${className}`}>
    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}:</div>
    <div className={`text-sm font-semibold text-neutral-900 dark:text-neutral-100 ${multiline ? "col-span-1" : ""}`}>
      {multiline ? <p className="whitespace-pre-wrap">{value || "—"}</p> : (value || "—")}
    </div>
  </div>
);

const EditIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 rounded p-1 text-black hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300 transition-colors"
    aria-label="Edit section"
  >
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5l4 4L7 21l-4 1 1-4 12.5-14.5z" />
    </svg>
  </button>
);

const StatusBadge = ({ status }) => {
  if (!status) return <span className="text-sm text-neutral-500 dark:text-neutral-400">—</span>;
  
  const colorVariants = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    Sold: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  };

  const variant = colorVariants[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant}`}>
      {status}
    </span>
  );
};

const MediaModal = ({ media, onClose }) => (
  <AnimatePresence>
    {media && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-white/90 p-2 text-black shadow-lg hover:bg-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {media.mediaCategory === "Photo" ? (
            <img
              src={media.mediaURL}
              alt={media.shortDescription || "Property media"}
              className="max-h-full max-w-full object-contain"
            />
          ) : media.mediaCategory === "Video" ? (
            <video
              src={media.mediaURL}
              controls
              className="max-h-full max-w-full object-contain"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          ) : null}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function DisplayProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { loading, error, data } = useStaffPropertyDetail(id);

  const property = data?.propertyDetails || {};
  const agent = data?.agentDetails || {};
  const isSale = property.propertyFor === "sale";

  const address = useMemo(() => {
    const parts = [
      property.unitNumber && `#${property.unitNumber}`,
      property.streetNumber,
      property.streetName,
      property.streetSuffix,
    ].filter(Boolean).join(" ");
    return parts ? `${parts}, ${property.city}, ${property.stateProvince} ${property.postalCode}` : "—";
  }, [property]);

  const handleEditSection = (section) => {
    navigate(`/admin/property/${id}/edit`);
  };

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
  };

  if (loading) {
    return <Loader label="Loading property details…" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
        <button
          onClick={() => navigate("/admin/property")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-neutral-500 dark:text-neutral-400">Property not found.</div>
      </div>
    );
  }

  const infoSections = [
    {
      title: `${isSale ? "Sale" : "Rent"} Property Information`,
      content: (
        <div className="space-y-2">
          <DisplayRow label="Property For" value={property.propertyFor?.toUpperCase()} />
          <DisplayRow label="Type" value={property.type} />
          <DisplayRow label="Subtype" value={property.subtype} />
          <DisplayRow label="Status" value={<StatusBadge status={property.status} />} />
          <DisplayRow label="Listing Date" value={formatDate(property.listingDate)} />
          {isSale ? (
            <DisplayRow label="List Price" value={money(property.listPrice, property.currency)} />
          ) : (
            <DisplayRow label="Rent Price" value={money(property.rentPrice, property.currency)} />
          )}
          <DisplayRow label="Currency" value={property.currency} multiline />
          <DisplayRow label="Description" value={property.description} multiline className="!grid-cols-1" />
          {property.isPrivateRoom !== undefined && (
            <DisplayRow label="Private Room in Shared Property" value={property.isPrivateRoom ? "Yes" : "No"} />
          )}
        </div>
      ),
      onEdit: () => handleEditSection("property")
    },
    {
      title: "Location Information",
      content: (
        <div className="space-y-2">
          <DisplayRow label="Full Address" value={address} multiline className="!grid-cols-1" />
          <DisplayRow label="Unit Number" value={property.unitNumber} />
          <DisplayRow label="Street Number" value={property.streetNumber} />
          <DisplayRow label="Street Name" value={property.streetName} />
          <DisplayRow label="Street Suffix" value={property.streetSuffix} />
          <DisplayRow label="City" value={property.city} />
          <DisplayRow label="State/Province" value={property.stateProvince} />
          <DisplayRow label="Postal Code" value={property.postalCode} />
          <DisplayRow label="Latitude" value={property.latitude} />
          <DisplayRow label="Longitude" value={property.longitude} />
          <DisplayRow label="Subdivision" value={property.subdivision} multiline className="!grid-cols-1" />
        </div>
      ),
      onEdit: () => handleEditSection("location")
    },
    {
      title: "Interior Information",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <DisplayRow label="Bedrooms" value={property.bedrooms} />
            <DisplayRow label="Total Baths" value={property.totalBath} />
            <DisplayRow label="Half Baths" value={property.halfBath} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DisplayRow label="Living Area (sqft)" value={property.livingArea} />
            <DisplayRow label="Floor Area (sqft)" value={property.floorArea} />
          </div>
          <DisplayRow label="Interior Features" value={property.interiorFeatures} multiline className="!grid-cols-1" />
          <DisplayRow label="Heating System" value={property.heatingSystem} />
          <DisplayRow label="Total Fireplaces" value={property.totalFireplace} />
          <DisplayRow label="Fireplace Features" value={property.fireplaceFeature} multiline className="!grid-cols-1" />
          <DisplayRow label="Laundry Features" value={property.laundryFeature} multiline className="!grid-cols-1" />
          <DisplayRow label="Appliances" value={property.appliances} multiline className="!grid-cols-1" />
        </div>
      ),
      onEdit: () => handleEditSection("interior")
    },
    {
      title: "Exterior Information",
      content: (
        <div className="space-y-2">
          <DisplayRow label="Parking" value={property.parking} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <DisplayRow label="Lot Size (acres)" value={property.lotAcre} />
            <DisplayRow label="Lot Size (sqft)" value={property.lotSqft} />
            <DisplayRow label="Open Parking" value={property.openParking} />
          </div>
          <DisplayRow label="Total Parking" value={property.totalParking} />
          <DisplayRow label="Lot Dimensions" value={property.lotDimensions} multiline className="!grid-cols-1" />
          <DisplayRow label="Lot Features" value={property.lotFeatures} multiline className="!grid-cols-1" />
          <DisplayRow label="Parking Features" value={property.parkingFeatures} multiline className="!grid-cols-1" />
          <DisplayRow label="View Description" value={property.viewDescription} multiline className="!grid-cols-1" />
          <DisplayRow label="Exterior Features" value={property.exteriorFeatures} multiline className="!grid-cols-1" />
        </div>
      ),
      onEdit: () => handleEditSection("exterior")
    },
    {
      title: "Building & Community Information",
      content: (
        <div className="space-y-2">
          <DisplayRow label="Strata" value={property.strata} />
          <DisplayRow label="Amenities" value={property.amenities} multiline className="!grid-cols-1" />
          <DisplayRow label="Pet Policy" value={property.petPolicy} multiline className="!grid-cols-1" />
        </div>
      ),
      onEdit: () => handleEditSection("building")
    },
    {
      title: "Financial Information",
      content: (
        <div className="space-y-2">
          <DisplayRow label="Tax Year" value={property.taxYear} />
          <DisplayRow label="Annual Tax Amount" value={money(property.annualTaxAmount, property.currency)} />
          <DisplayRow label="Price Per Sqft" value={money(property.pricePerSqft, property.currency)} />
        </div>
      ),
      onEdit: () => handleEditSection("financial")
    }
  ];

  return (
    <div className="p-6">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Property", to: "/admin/property" },
          { label: property.listingId || "Property Details" },
        ]}
      />

      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Property Details
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Listing ID: {property.listingId || "—"} | Status: <StatusBadge status={property.status} />
          </p>
        </div>
      </div>

      {/* Agent Info - Redesigned */}
      <SectionCard title="Agent Information" className="mb-6 relative">
        <div className="flex items-start gap-6 p-4">
          <div className="flex-shrink-0">
            {agent.photoUrl ? (
              <img 
                src={agent.photoUrl} 
                alt={agent.fullName} 
                className="size-24 rounded-full object-cover ring-2 ring-blue-500" 
              />
            ) : (
              <div className="size-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center ring-2 ring-blue-500">
                <span className="text-lg font-bold text-neutral-500 dark:text-neutral-400">A</span>
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DisplayRow label="Full Name" value={agent.fullName} className="grid-cols-1" />
            <DisplayRow label="Email" value={agent.email} className="grid-cols-1" />
            <DisplayRow label="MLS ID" value={agent.mlsId} />
            <DisplayRow label="License Number" value={agent.licenseNumber} />
            <DisplayRow label="Licensed As" value={agent.licensedAs} />
            <DisplayRow label="Personal Real Estate Corporation" value={agent.personalRealEstateCorporationName} />
            <DisplayRow label="Licensed For" value={agent.licensedFor} />
          </div>
        </div>
        <EditIcon onClick={() => handleEditSection("agent")} />
      </SectionCard>

      {/* Media - Redesigned as Cards with Details and Modal */}
      <SectionCard title="Media" subtitle={`${property.media?.length || 0} items (Photos & Videos)`} className="relative mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {property.media?.length > 0 ? (
            property.media.map((item) => (
              <motion.div
                key={item.mediaObjectID}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer space-y-2 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 hover:border-blue-500 transition-colors"
                onClick={() => handleMediaClick(item)}
              >
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  {item.mediaCategory === "Photo" ? (
                    <img
                      src={item.mediaURL}
                      alt={item.shortDescription || "Property media"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : item.mediaCategory === "Video" ? (
                    <video
                      src={item.mediaURL}
                      className="w-full h-full object-cover"
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {item.mediaCategory} #{item.order + 1}
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 truncate">
                    {item.shortDescription || "No description"}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Size: {formatFileSize(item.fileSize)} | Type: {item.mimeType || "image/jpeg"}
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 truncate">
                    Resource: {item.resourceName || item.mediaObjectID}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center py-8 text-neutral-500 dark:text-neutral-400">No media available.</p>
          )}
        </div>
        <EditIcon onClick={() => handleEditSection("media")} />
        <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      </SectionCard>

      {/* Info Sections - 2 Cards per Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {infoSections.map((section, index) => (
          <SectionCard key={index} title={section.title} className="relative">
            {section.content}
            <EditIcon onClick={section.onEdit} />
          </SectionCard>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 border-t pt-6">
        <p>Created: {formatDate(data.createdAt)}</p>
        <p>Last Updated: {formatDate(data.updatedAt)}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          to="/admin/property"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
        >
          Back to Properties
        </Link>
      </div>
    </div>
  );
}