import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {gemoji} from "gemoji";
import {SimplebarAngularComponent} from "simplebar-angular";
type EmojiCategory = "Smileys & People" | "Animals & Nature" | "Food & Drink" | "Activities" |
    "Travel & Places" | "Objects" | "Symbols" | "Flags";
export type Emoji = { emoji: string; category: string };

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
  @Output() emojiPicked = new EventEmitter<Emoji>();
  gemojiList: Emoji[] = [];
  selectedGemojiList: Emoji[] = [];
  gemojiCategories: { category: EmojiCategory, emoji: string }[] = [
    {category: "Smileys & People", emoji: "😃"},
    {category: "Animals & Nature", emoji: "🐻"},
    {category: "Food & Drink", emoji: "🍔"},
    {category: "Activities", emoji: "⚽"},
    {category: "Travel & Places", emoji: "🚀"},
    {category: "Objects", emoji: "💡"},
    {category: "Symbols", emoji: "💕"},
    {category: "Flags", emoji: "🎌"}
  ];
  selectedEmojiCategory: EmojiCategory = "Smileys & People";

  ngOnInit(): void {
    this.gemojiList = gemoji.map((data: any) => (
        {
          category: data.category === "Smileys & Emotion" || data.category === "People & Body" ? "Smileys & People" : data.category,
          emoji: data.emoji
        }));

    this.selectedGemojiList = this.gemojiList.filter(item => item.category === this.selectedEmojiCategory);
  }

  listEmojiByCategory() {
    // return this.gemojiList.filter(item => item.category === category);
  }

  selectEmojiCategory(category: EmojiCategory, scrollBar: SimplebarAngularComponent) {
    this.scrollToTop(scrollBar);
    this.selectedEmojiCategory = category;
    this.selectedGemojiList = this.gemojiList.filter(item => item.category === category);
  }

  scrollToTop(scrollBar: SimplebarAngularComponent) {
    scrollBar.SimpleBar.getScrollElement().scrollTop = 0;
  }

  chooseEmoji(emoji: Emoji) {
    this.emojiPicked.emit(emoji);
  }

}
