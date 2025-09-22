import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";




export default [
    //Sign-in Logik -> Abfrage User ? -> Login oder Aufruf /
    route('sign-in', 'routes/root/sign-in.tsx'),
    route("api/create-trip", "routes/api/create-trip.ts"),
    //Layout steuert per Loader die Logik der Seite. Kein User -> sign-in
    layout('routes/admin/admin-layout.tsx', [
    route('dashboard', 'routes/admin/dashboard.tsx'),
        route('all-users', 'routes/admin/all-users.tsx'),
        route('trips', 'routes/admin/trips.tsx'),
        route("create-trip", "routes/admin/create-trip.tsx"),
        route("trip-detail", "routes/admin/trip-detail.tsx"),

    ])
] satisfies RouteConfig;