# todo


## bugs, issues

- cascade deletes aren't working, check them all.
  - brewery -> beer
  - beer -> keg
- 'value prop on input should not be null'
  - models with strings should probably be NOT NULL, default to empty string
  - make sure we handle dates properly
- implement a 404 page and use it


## new features, improvements

- Make Cheersing work on the Keg Detail view
- Link to the Keg Detail from the Keg List view?
  - UI needs to be more helpful distinguishing/explaining Kegs vs Beers
- Searchable ModelSelect
- Inline 'Add Brewery' from the Add Beer view
- Brewery list should be searchable
- New Keg & New Beer views parse querystrings to pre-fill the beerId or breweryId
- 'Delete {Model}' buttons should be moved to inside the edit form for consistency
  - Keg and Beer
  - Ensure there's a confirmation action too
- Datepicker for the change tap view
- Allow users to remove their own Cheers
- 'Add a Beer' should link to beers/new instead of inline creation
- Loader used to look better (the wave motion was clearer) - fix it or implement a new one
- Untappd integration
  - Fetch beer/brewery details from Untappd
  - Link to beer/brewery on Untappd
- Proper routing (non-hash)
- Prevent Cheersing a yet-to-be-tapped keg. Requires fixing the default Invalid Date issue on the Keg.
- cheersKeg() in api should just return the new Cheers and the KegId, not the kitchen sink
- API tests: auth, nested objects, expected attributes etc

## cleanup/refactor:

- Consistent patterns for all of the stores
  - Generic stores for list and detail components
- Change any <A>s without hrefs to buttons
- Implement autoLoader everywhere we're using Loader
- Make the CRUD forms all implement EditForm component
  - Bake in some validation
