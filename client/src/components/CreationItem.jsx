import { Trash2 } from "lucide-react";
import React from "react";

const CreationItem = ({ item, onSelect }) => {
  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl p-3.5 md:p-5  hover:shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer"
      onClick={() => onSelect?.(item)}>
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
          {item.type}
        </span>

        <button className="xl:opacity-0  xl:group-hover:opacity-100 transition text-gray-400 hover:text-gray-600 cursor-pointer">
          <Trash2 size={16} className="text-red-400 hover:text-red-500" />
        </button>
      </div>

      {/* Prompt */}
      <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed h-12">
        {item.prompt}
      </p>

      {/* Footer */}
      <div className="mt-2 pt-1 border-t border-gray-100 text-xs  text-gray-500">
        Created on - {new Date(item.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default React.memo(CreationItem);
