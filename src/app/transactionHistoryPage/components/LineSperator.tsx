import React from 'react'

interface Props{
  text: string
}

const LineSeparator = ({ text }: Props) => {
  return (
    <div className="col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 3xl:col-span_5 flex items-center">
      <span className="left-0 px-4 bg-transparent text-gray-400 z-10">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-400 overflow-hidden"></div>
    </div>
  )
}

export default LineSeparator