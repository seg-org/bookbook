import React from 'react'


// Note 1: Waiting for global font
// Note 2: The pop=up calendat can not be configured
const FilterBar = () => {
  return (
    <div className='flex lg:flex-row items-center p-2.5 justify-between flex-col'>
      <div className='justify-start space-x-5 flex flex-row'>
        <div className='space-x-2.5 items-center flex flex-row'>
          <label className='text-gray-800 font-medium'>ตั้งแต่วันที่</label>
          <input className='rounded-lg p-1 border border-gray-300' type='date'/>
          <label className='text-gray-800 font-medium'>ถึงวันที่</label>
          <input className='rounded-lg p-1 border border-gray-300' type='date'/>
        </div>
        <div className='space-x-2.5 items-center flex flex-row'>
          <input className='h-5 w-5' type='checkbox'/>
          <label className='text-gray-800 font-medium'>ซื้อ</label>
          <input className='h-5 w-5' type='checkbox'/>
          <label className='text-gray-800 font-medium'>ขาย</label>
        </div>
      </div>
      <div className='justify-start space-x-10 flex flex-row items-center'>
        <div className='space-x-2.5 items-center flex flex-row'>
          <label className='text-gray-800 font-medium'>ยอดซื้อ :</label>
          <label className='text-gray-800 font-medium'>30.0</label>
          <label className='text-gray-800 font-medium'>ยอดขาย :</label>
          <label className='text-gray-800 font-medium'>70.0</label>
        </div>
        <div className='space-x-2.5 items-center flex flex-row'>
          <label className='text-gray-800 font-medium'>ยอดรวม :</label>
          <label className='text-gray-800 font-medium'>40.0</label>
        </div>
      </div>
    </div>
  )
}

export default FilterBar