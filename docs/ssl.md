# SSL Certificate

This server is configured to only use HTTPS so it won't even start without an SSL cert. There are two ways of doing this, you can either generate a self-signed cert (only recommended for development) or you can get Let's Encrypt to issue you one using their automated Certbot tool.

## Let's Encrypt

The first step here is to install the Certbot tool. Installation instructions reside [here](https://certbot.eff.org/). Once you have Certbot, you should be able to run `where letsencrypt` and get a non-error result. Certbot supports a lot of common server software on a bunch of platforms but it doesn't yet support Node.js so we're going to have sort of a manual process.

The step are as follows.

1. Put the server in verification mode by running `node index.js --letsencrypt-verify` at the command line.
2. Make sure that the server responds to the domain that you want to get an SSL certificate for. For example, if your domain is `hue-remote.example.com`, make sure that the server will respond to `http://hue-remote.example.com`. This will probably involve creating a DNS record with your domain registrar and forwarding the correct ports (port 80 for HTTP and port 443 for HTTPS) on your router.
3. Run `letsencrypt certonly --webroot -w ./static -d <your_domain_name>`. See the explanation below for what this command does.
4. You should now have 4 files in `/etc/letsencrypt/live/<your_domain_name>` - `cert.pem`, `chain.pem`, `fullchain.pem` and `privkey.pem`. You're going to need `fullchain.pem` and `privkey.pem` for this server. Some explanation about these files is [here](http://letsencrypt.readthedocs.io/en/latest/using.html#where-are-my-certificates).
5. Either copy them over to the `sslcert/` directory or create symlinks for them into the `sslcert/` directory. Be sure to rename `fullchain.pem` to `cert.pem` and `privkey.pem` to `key.pem`.

**NOTE** - Let's Encrypt certificates are only good for 90 days. To renew them, run through this process again. This is why it's suggested that you create symlinks so you can save a step.

### Some explanation

The `letsencrypt` command deserves some explanation. The `certonly` subcommand tells Certbot that you only want it to generate the cert, not install any utilities for your server. The Certbot verification method that we're using puts a file in a certain location (`./static/.well-known/acme-challenge`) and then uses your server to retrieve that file over HTTP. If that succeeds, then they generate a certificate for you. The `--webroot` switch puts Certbot in the mode described above. The `-w` switch tells Certbot where to put the file and the `-d` switch tells the Certbot what domain to get a certificate for.

The server is already set up to serve anything under the `static/` folder with the correct folder structure. The challenge URL that Certbot looks for is `/.well-known/acme-challenge/<some_id>`. Since everything under `static/` is hosted and express does the mapping, we just need to create the folder structure and everything is happy.

## Generating a self-signed certificate

I'm going to say this again here, this is only recommended for development, not production.

There is really only one requirement for this and it is the `openssl` utility. It is available for most platforms and even comes preinstalled on some.

As a note, if you are using a Mac and have previously installed `openssl`, you will need to update `openssl` to make sure that you can generate strong SSL certificates. The easiest way to do that is to update via Homebrew by running `brew upgrade openssl`.

Once you have `openssl`, run these commands one by one in your terminal window,

```shell
openssl genrsa -out key.pem 2048
openssl req -new -sha256 -key key.pem -out csr.csr
openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out cert.pem
```

The `./sslcert` directory is where the application looks for the `key.pen` and the `cert.pem` file. Running the commands from inside that folder is advised. You can also append `sslcert/` to all of the files in the commands above and be okay.

### Some more explanation

The first command generates a 2048-bit RSA private key. The second generates what's called a Certificate Signing Request. This is what you would generally send to a CA to get signed so that you don't see the invalid certificate error. This command will also ask for some information, fill in what you can since you're not going to send it to an actual CA anyway.

The third command generates a self-signed x509 certificate which can then be used to enable HTTPS on web servers.
