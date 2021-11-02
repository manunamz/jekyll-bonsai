---
id: 75e5216b0e
title: Test
desc: ''
updated: 1632934422000
created: 1632841425746
date: 2021-08-04
status: 🎋
---

This is a page is for testing and showcasing the markodwn styles in this template.

## Links

Valid Wikilink:
[[root]]

Typed Wikilink: the-main-event::[[root]]

block-wikilink::[[root]]

block-list-wikilnks :: 
- [[root]]
- [[feedback]]

Invalid Wikilink:
[[not-jekyll-bonsai]]

Weblink:
<https://manunamz.github.io/jekyll-bonsai>

## Markdown

Headers:
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

Lists:
- One
- Two
- Three

Code Block:
```javascript
// javascript
for (var i=1; i < 101; i++){
    if (i % 15 == 0) console.log("FizzBuzz");
    else if (i % 3 == 0) console.log("Fizz");
    else if (i % 5 == 0) console.log("Buzz");
    else console.log(i);
}
```
```ruby
# ruby
 1.upto 100 do |i|
  string = ""
  string += "Fizz" if i % 3 == 0
  string += "Buzz" if i % 5 == 0
  puts "#{i} = #{string}"
end
```

Inline Code:
Alright, `alright`, alright.

Tables:

| Rabbits | Foxes | Hedgehogs |
| ------- | ----- | --------- |
| 25      | 3     | 12        |
| 100     | 10    | 20        |
