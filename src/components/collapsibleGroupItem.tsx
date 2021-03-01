import React, { 
    ReactElement, 
    useState 
  } from "react"
  
  export interface CollapsibleGroupItemProps {
    id: string;
    name: string;
    description: string;
  }
  
  function CollapsibleGroupItem(
    props: CollapsibleGroupItemProps
  ): ReactElement {
    const [isVisible, setVisible] = useState(false)
  
    return (
      <div
        className="rounded-sm"
      >
        <div
          className="border border-b-0 bg-gray-100 px-10 py-6"
        >
          <button
            className="underline text-blue-500 hover:text-blue-700 focus:outline-none"
            type="button"
            onClick={() => setVisible(prev => !prev)}
          >
            {props.name}
          </button>
        </div>
        {isVisible && <div
          className="border border-b-0 px-10 py-6"
        >
          {props.description}
        </div>}
      </div>
    )
  }
  
  export default CollapsibleGroupItem