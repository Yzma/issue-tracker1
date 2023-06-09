import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleDot,
  faCheck,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckIcon } from '@radix-ui/react-icons'
import { IssueListContext } from './IssueList'

export default function IssueListHeader() {
  const { searchFilters, setSearchParam } = useContext(IssueListContext)
  return (
    <div className="flex justify-between w-full p-4 border rounded-t-md border-gray-200 bg-gray-50">
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          className={`flex items-center gap-x-1 ${
            searchFilters.open ? 'text-blue-500' : ''
          }`}
          onClick={() => setSearchParam('open', true)}
        >
          <FontAwesomeIcon icon={faCircleDot} />
          <p
            className={`font-semibold text-gray-900 ${
              searchFilters.open ? 'text-blue-500' : ''
            }`}
          >
            Open
          </p>
        </button>

        <button
          type="button"
          className={`flex items-center gap-x-1 
            ${!searchFilters.open ? 'text-blue-500' : ''}
          `}
          onClick={() => setSearchParam('open', false)}
        >
          <FontAwesomeIcon icon={faCheck} />
          <p
            className={`font-semibold text-gray-900 ${
              !searchFilters.open ? 'text-blue-500' : ''
            }`}
          >
            Closed
          </p>
        </button>
      </div>

      <div className="flex items-center gap-x-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex gap-x-2 text-gray-500 items-center hover:text-gray-600">
              <p className="font-semibold text-gray-900">Sort</p>
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}
            >
              <DropdownMenu.CheckboxItem
                className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                checked={searchFilters.sort === 'newest'}
                onClick={() => setSearchParam('sort', 'newest')}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
                Newest
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                checked={searchFilters.sort === 'oldest'}
                onClick={() => setSearchParam('sort', 'oldest')}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
                Oldest
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                checked={searchFilters.sort === 'recently-updated'}
                onClick={() => setSearchParam('sort', 'recently-updated')}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
                Recently Updated
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                checked={searchFilters.sort === 'least-recently-updated'}
                onClick={() => setSearchParam('sort', 'least-recently-updated')}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
                Least Recently Updated
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}
