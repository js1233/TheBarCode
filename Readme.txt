Following Convention will be used in this project:

NAMING:
--Components--
-> List Item Component should have a prefix of "Item". For example: ItemVenue
-> Screen Controller Component should have a suffix of "Controller". For example: VenueListController
-> Screen UI Component should have a suffix of "View". For example: VenueListView
-> If required, Object Detail Component should have a prefix of "DetailView". For example: OrderDetailView

--Styles--
-> Text style should be same as Model key. For example: {styles.title} for AppLabel having title
-> Wrapping view style should have "Container" as suffix. For example:
{styles.titleContainer} for View wrapping "title"
{styles.titleSubtitleContainer} for View wrapping "title" and "subtitle"
{styles.textsContainer} for View wrapping text details, i.e. title, subtitle and description

--Icon--
-> Icon should have a suffix of "ic_". For example: "ic_bell.svg"

--General--
-> In case of list, plural form of that word should be used, rather than List as Suffix

THEME:
-> Screen background color should be "primaryBackgroundColor"
-> View drawn on screen should be "secondaryBackgroundColor"
-> View drawn on secondaryBackgroundColor should be "tertiaryBackgroundColor"
-> Most widely used text color should be "primaryLabelColor"
-> Second most used text color should be "secondaryLabelColor"

WHEN DESIGNING:
--List Item Component--
1) Create a model using expected response object. For example: Venue.ts
2) Send a single argument as Prop when defining component. For example:
type Props = {
  venue: Venue;
};
3) Binds the model when design
-> Spacing should boxy where possible. Left-Right-Top-Bottom should be same
-> After designing, keep app side-by-side with Figma design at same zoom level and fix differences
-> Keep wrapping view as-minimum-as-possible.
4) Send a dummy object when share build for QA

--Screen Component--
-> It should set toolbar in Controller
-> Proper View-Controller code structure should be created, AT THE TIME OF DESIGNING. Don't wait for integration phase!

TBC Re-branding Specific
Following Model Schema will be used:
1. Venue
2. Product
3. Modifier
4. Offer
5. Event
6. Preferences
