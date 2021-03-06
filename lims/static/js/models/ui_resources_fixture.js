{   
  "home": {
    "title": "Screensaver LIMS",
    "route": "/",
    "view": "HomeView",
    "content_header": "Welcome",
    "description": "Menu starting point"
  },
  "about": {
    "title": "ICCB-L Screensaver LIMS",
    "route": "about",
    "view": "AboutView",
    "content_header": "ICCB-L Screensaver LIMS",
    "description": "About page"
  },

  "screensaveruser": {
        "header_message": "All users (Screeners and Staff)",
        "title": "Screensaver Users",
        "route": "list/screensaveruser",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screensaveruser",
        "url_root": "/db/api/v1",
        "description": "View user information"
    },

    "screeners": {
        "header_message": "Screening Users",
        "title": "Screeners",
        "route": "list/screeners",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screensaveruser",
        "url_root": "/db/api/v1",
        "description": "View user information",
        "options": { "search": {"screeningroomuser__isnull": "False"} }
    },

    "staff": {
        "header_message": "Staff",
        "title": "Staff Users",
        "route": "list/staff",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screensaveruser",
        "url_root": "/db/api/v1",
        "description": "View user information",
        "options": { "search": {"administratoruser__isnull": "False"} }
    },
    "screen": {
        "header_message": "All screens (Small Molecule and RNAi)",
        "title": "Screens",
        "route": "list/screen",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screen",
        "url_root": "/db/api/v1",
        "description": "View screen information",
        "options": { "order_by": { "facility_id":"-"} }
    },
    "small_molecule_screens": {
        "header_message": "Small Molecule Screens",
        "title": "Small Molecule",
        "route": "list/small_molecule_screens",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screen",
        "url_root": "/db/api/v1",
        "description": "View small molecule screen information",
        "options": { "search": { "screen_type": "small_molecule"} }
    },
    "rnai_screens": {
        "header_message": "All screens (Small Molecule and RNAi)",
        "title": "RNAi",
        "route": "list/rnai_screens",
        "list_view": "ListView",
        "detailView": "DetailView",
        "api_resource": "screen",
        "url_root": "/db/api/v1",
        "description": "View rnai screen information",
        "options": { "search": { "screen_type": "rnai"} }
    },
    "library": {
        "header_message": "All libraries (Small Molecule and RNAi)",
        "title": "Libraries",
        "route": "list/library",
        "list_view": "ListView",
        "detailView": "LibraryView",
        "api_resource": "library",
        "url_root": "/db/api/v1",
        "description": "View library information"
    },
    "smallmoleculelibrary": {
        "header_message": "Small Molecule Libraries",
        "title": "Small Molecule",
        "route": "list/smallmoleculelibrary",
        "list_view": "ListView",
        "detailView": "LibraryView",
        "api_resource": "library",
        "url_root": "/db/api/v1",
        "description": "View Small Molecule Library information",
        "options": { "search": { "screen_type": "small_molecule"} }
    },
    "rnalibrary": {
        "header_message": "RNAi Libraries",
        "title": "RNAi",
        "route": "list/rnalibrary",
        "list_view": "ListView",
        "detailView": "LibraryView",
        "api_resource": "library",
        "url_root": "/db/api/v1",
        "description": "View RNAi library information",
        "options": { "search": { "screen_type": "rnai"} }
    }
}