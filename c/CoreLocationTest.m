//
// Using CoreLocation on Mac OS X with command-line
// $ clang CoreLocationTest.m -framework cocoa -framework CoreLocation
// $ ./a.out 
#import <cocoa/cocoa.h>
#import <CoreLocation/CoreLocation.h>
#import <CoreLocation/CLGeocoder.h>
#define NSLog(FORMAT, ...) fprintf(stderr, "%s\n", [[NSString stringWithFormat:FORMAT, ##__VA_ARGS__] UTF8String]);

CLLocationManager *manager;

@interface NSObject(CB)
- (void)locationManager:(CLLocationManager *)manager
    didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation;
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error;
@end

@implementation NSObject(CB)
- (void)logLonLat:(CLLocation*)location
{
    CLLocationCoordinate2D coordinate = location.coordinate;
    CLGeocoder *reverseGeocoder = [[CLGeocoder alloc] init];
    [reverseGeocoder reverseGeocodeLocation:location completionHandler:^(NSArray *placemarks, NSError *error)
     {
        NSLog(@"reverseGeocodeLocation:completionHandler: Completion Handler called!");
        if (error){
            NSLog(@"Geocode failed with error: %@", error);
            return;
        }
        NSLog(@"Received placemarks: %@", placemarks);
        CLPlacemark *myPlacemark = [placemarks objectAtIndex:0];
        NSString *city = myPlacemark.locality;
        NSString *neighborhood = myPlacemark.subLocality;
        NSString *combined = [NSString stringWithFormat:@"%@, %@", neighborhood, city];
         printf("<body style='overflow:hidden;'><iframe src='http://localhost:8080/?lat=%f&lon=%f&name=%s' width='100%%' height='100%%' style='overflow:hidden;' scrolling='no' frameBorder='0'></iframe></body>", coordinate.latitude, coordinate.longitude, [combined UTF8String]);
        exit(0);
     }];
}

- (void)locationManager:(CLLocationManager *)manager
    didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
    [self logLonLat:newLocation];
    [pool drain];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error{
    NSLog(@"Error: %@", error);
}
@end

int main(int ac,char *av[])
{
    id obj = [[NSObject alloc] init];
    id lm = nil;
    if ([CLLocationManager locationServicesEnabled]) {
		lm = [[CLLocationManager alloc] init];
		[lm setDelegate:obj];
		[lm startUpdatingLocation];
    }

    CFRunLoopRun();
    [lm release];
    [obj release];
    return 0;
}
