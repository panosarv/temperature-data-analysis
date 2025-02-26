import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function GroupCheckbox({ options, selectedItems, onChange }) {
    const allChecked = selectedItems.length === options.length;
    const isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < options.length;
  
    const onGroupChange = (checked) => {
      const newSelectedItems = checked ? options.map((option) => option.id) : [];
      onChange?.(newSelectedItems);
    };
  
    const onItemChange = (checked, itemId) => {
      const newSelectedItems = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId);
      onChange?.(newSelectedItems);
    };
  
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={allChecked}
            onCheckedChange={onGroupChange}
            ref={(ref) => {
              if (!ref) return;
              ref.indeterminate = isIndeterminate;
            }}
          />
          <Label htmlFor="select-all">Select All</Label>
        </div>
        <div className="ml-6 space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 ">
              <Checkbox
                id={option.id}
                checked={selectedItems.includes(option.id)}
                onCheckedChange={(checked) => onItemChange(checked, option.id)}
                className="bg-beige"
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  }
  

export default GroupCheckbox

