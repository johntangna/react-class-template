type ObjectType = "Number" | "String" | "Boolean" | "Object" | "Array" | "Null" | "Undefined"

export function typeIs(value: any): ObjectType {
  return Object.prototype.toString.call(value).slice(8, -1) as ObjectType
}

export function dateFormat(fmt: string, date: Date) {
  let reg
  const ops = {
      "Y+": date.getFullYear().toString(),
      "m+": (date.getMonth() + 1).toString(),
      "d+": date.getDate().toString(),
      "H+": date.getHours().toString(),
      "M+": date.getMinutes().toString(),
      "S+": date.getSeconds().toString(),
  }

  for (const op in ops) {
      reg = new RegExp("(" + op + ")").exec(fmt)
      if (reg) {
          fmt = fmt.replace(reg[1], reg[1].length <= 1 ? ops[op as keyof typeof ops] : ops[op as keyof typeof ops].padStart(2, '0'))
      }
  }
  return fmt
}