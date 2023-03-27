//
// NOTE: This include file is only used to hold the content for the main page
// generated by Doxygen.
//


/**
 * @mainpage REST C API Documentation
 * @section intro_sec Introduction
 * This API provides a comprehensive, easy to use interface into REST APIs.
 * @section objects Using the Objects
 * The APIs utilize an Object pattern in C.  The pattern can be used in
 * one of two ways:
 *  - Stack-based objects
 *    -# Declare an object in your local variables
 *    -# Intialize it by calling the &lt;Class&gt;_init function, passing the
 *       object address as 'self'
 *    -# Call member functions using the object address as 'self'
 *    -# Destroy the object by calling the &lt;Class&gt;_destroy function, passing
 *       the object address as 'self'.
 *  - Heap-based objects
 *    -# Declare an object pointer in your local variables.
 *    -# Intialize the object by calling the &lt;Class&gt;_init function, using
 *       malloc(sizeof(&lt;Class&gt;)) as the input 'self' parameter.  Assign the
 *       output to your pointer.
 *    -# Call member functions by using the pointer as 'self'.
 *    -# Destroy the object by calling the &lt;Class&gt;_destroy function, passing
 *       the pointer as 'self'.
 *    -# Free the pointer with free().
 *
 * ### Examples
 *
 * #### Stack-based Object
 *
 * \code{.c}
 *     void main(void) {
 *         Object myobj;
 *
 *         Object_init(&myobj);
 *         printf("Object class: %s\n", Object_get_class_name(&myobj));
 *         Object_destroy(&myobj);
 *     }
 * \endcode
 *
 * #### Heap-based Object
 *
 * \code{.c}
 *     void main(void) {
 *         Object *myobj;
 *
 *         myobj = Object_init(malloc(sizeof(Object)));
 *         printf("Object class: %s\n", Object_get_class_name(myobj));
 *         Object_destroy(myobj);
 *         free(myobj);
 *     }
 * \endcode
 *
 * @section making REST calls
 * Making a REST call invovles two steps.  First, you initialize a RestClient
 * object to maintain connection state between you and the server.  After
 * creating the RestClient, you create one or more RestRequest and RestResponse
 * objects to send and receive data from the REST service.
 *
 * @section Customization
 * There are two points for customizing how the requests are executed.  First,
 * you can add a rest_curl_config_handler function to the RestClient object.
 * This function will be executed just before each request is sent and will
 * allow you to inspect and/or tweak the settings on the CURL handle.  Examples
 * of this would be to enable/disable logging (rest_verbose_config()), disable
 * SSL certificate checking (rest_disable_ssl_cert_check()), etc.
 *
 * The second customization point is with RestFilter objects.  Each RestRequest
 * is executed with a RestFilter chain.  This chain allows you to control the
 * request flow, modify the request, parse the response, etc.  Some examples
 * are authentication management, request signing, XML parsing, error handling,
 * etc.  Note that every request must be executed with a handler that actually
 * invokes CURL to send the request.  The default implementation is
 * RestFilter_execute_curl_request().
 *
 * @section Extension
 * While you can use the default implementations of RestRequest and RestResponse
 * to execute generic REST requests, you will likely want to subclass these
 * classes to provide enhanced functionality.  For example, if a server sends
 * back a JSON response, you could have a JSON response parser implementation
 * that parses the response and sets fields in a custom RestResponse class.
 *
 * @section Example
 * A basic request to load the content of http://www.google.com would look
 * like this:
 *
 * \code{.c}
 *  RestClient c;
 *  RestRequest req;
 *  RestResponse res;
 *  RestFilter* chain = NULL;
 *
 *  // Initialize the RestClient
 *  RestClient_init(&c, "www.google.com", 80);
 *
 *  // Intialize the request and response objects
 *  RestRequest_init(&req, "/", GET);
 *  RestResponse_init(&res);
 *
 *  // Build a filter chain to execute the request
 *  chain = RestFilter_add(chain, &RestFilter_execute_curl_request);
 *
 *  // Execute the request
 *  RestClient_execute_request(&c, chain, &req, &res);
 *
 *  // Check result.  If there is an issue communicating with the server (DNS
 *  // failures, connection failures, etc), the error will be in curl_error.
 *  // If the connection succeeds, the HTTP response code will be in http_code.
 *  assert_int_equal(0, res.curl_error);
 *  assert_int_equal(200, res.http_code);
 *
 *  // Cleanup
 *  RestFilter_free(chain);
 *  RestResponse_destroy(&res);
 *  RestRequest_destroy(&req);
 *  RestClient_destroy(&c);
 * \endcode
 */
