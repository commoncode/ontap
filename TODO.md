# todo


## bugs, issues

- 'value prop on input should not be null'
  - models with strings should probably be NOT NULL, default to empty string
  - make sure we handle dates properly


## new features, improvements

- Improve for mobile (UI overhaul would be nice)
- Prevent Cheersing a yet-to-be-tapped keg. Requires fixing the default Invalid Date issue on the Keg.
- cheersKeg() in api should just return the new Cheers and the KegId, not the kitchen sink
- API tests: auth, nested objects, expected attributes etc


## cleanup/refactor:

- Consistent patterns for all of the stores
  - Generic stores for list and detail components
- remove the CSS modules: KegListItem, Loader, TapList, Tap
- CSS styleguide for repeat components, patterns
- Implement autoLoader everywhere we're using Loader
- Make the CRUD forms all implement EditForm component
  - Bake in some validation
