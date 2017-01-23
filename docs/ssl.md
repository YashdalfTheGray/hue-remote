# SSL Certificate

## Prerequisites

There is really only one requirement for this and it is the `openssl` utility. It is available for most platforms and even comes preinstalled on some.

As a note, if you are using a Mac and have previously installed `openssl`, you will need to update `openssl` to make sure that you can generate strong SSL certificates. The easiest way to do that is to update via Homebrew by running `brew upgrade openssl`.

This server is configured to only use HTTPS so it won't even start without an SSL cert.

## Generating a self-signed certificate

Once you have `openssl`, run these commands one by one in your terminal window,

```shell
openssl genrsa -out key.pem 2048
openssl req -new -sha256 -key key.pem -out csr.csr
openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out cert.pem
```

The `./sslcert` directory is where the application looks for the `key.pen` and the `cert.pem` file. Running the commands from inside that folder is advised. You can also append `sslcert/` to all of the files in the commands above and be okay. 

The first command generates a 2048-bit RSA private key. The second generates what's called a Certificate Signing Request. This is what you would generally send to a CA to get signed so that you don't see the invalid certificate error. This command will also ask for some information, fill in what you can since you're not going to send it to an actual CA anyway.

The third command generates a self-signed x509 certificate which can then be used to enable HTTPS on web servers.
