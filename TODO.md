# todo


## bugs, issues

- cascade deletes aren't working, check them all.
  - brewery -> beer
  - beer -> keg
- 'value prop on input should not be null'
  - models with strings should probably be NOT NULL, default to empty string
  - make sure we handle dates properly
- handle 404s properly


## new features, improvements

- Make cheersing work on the Keg Detail view
- Proper routing (non-hash)
- Untappd integration
  - Fetch beer/brewery details from Untappd
  - Link to beer/brewery on Untappd
- Inline 'Add Brewery' from the Add Beer view
- Searchable ModelSelect
- Prevent Cheersing a yet-to-be-tapped keg. Requires fixing the default Invalid Date issue on the Keg.
- cheersKeg() in api should just return the new Cheers and the KegId, not the kitchen sink
- Brewery list should be searchable
- API tests: auth, nested objects, expected attributes etc
- New Keg & New Beer views parse querystrings to pre-fill the beerId or breweryId
- 'Delete {Model}' buttons should be moved to inside the edit form for consistency
  - Keg and Beer
  - Ensure there's a confirmation action too

## cleanup/refactor:

- Consistent patterns for all of the stores
  - Generic stores for list and detail components
- remove the CSS modules: KegListItem, Loader, TapList, Tap
- Change any <A>s without hrefs to buttons
- CSS styleguide for reusable components, patterns
- Implement autoLoader everywhere we're using Loader
- Make the CRUD forms all implement EditForm component
  - Bake in some validation
